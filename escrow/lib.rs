#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod escrow {
    use ink::env::call::{build_call, ExecutionInput, Selector};

    /// The time duration for the escrow lock, in milliseconds.
    /// 30 days = 30 * 24 * 60 * 60 * 1000 = 2,592,000,000 ms
    const THIRTY_DAYS: Timestamp = 2_592_000_000;
    use ink::storage::Mapping;

    #[derive(Debug, Clone, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum EscrowStatus {
        InProgress,
        Completed,
        Cancelled,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// The escrow has not yet reached its release time.
        EscrowNotExpired,
        /// The caller is not the designated chef.
        NotTheChef,
        /// The caller is not the customer.
        NotTheCustomer,
        /// The transfer of funds from the contract to the chef failed.
        TransferFailed,
        /// Escrow has already been completed or cancelled.
        EscrowFinished,
        /// Escrow not found for the given ID.
        EscrowNotFound,
        /// Insufficient funds to create escrow.
        InsufficientFunds,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    #[derive(Debug, Clone, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct EscrowDetails {
        /// The AccountId of the customer who deposits the funds.
        customer: AccountId,
        /// The AccountId of the chef who will receive the funds.
        chef: AccountId,
        /// The amount of funds in escrow.
        amount: Balance,
        /// The timestamp when the funds can be released to the chef.
        release_time: Timestamp,
        /// The current status of the escrow.
        status: EscrowStatus,
    }

    #[ink(storage)]
    pub struct Escrow {
        /// Mapping from an escrow ID to its details.
        escrows: Mapping<u32, EscrowDetails>,
        /// The next available escrow ID.
        next_escrow_id: u32,
    }

    impl Escrow {
        /// Creates a new escrow contract.
        ///
        /// The constructor is payable, meaning the customer must send funds
        /// when creating the contract. These funds are held in escrow.
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                escrows: Mapping::new(),
                next_escrow_id: 0,
            }
        }

        /// Creates a new escrow and deposits funds.
        #[ink(message, payable)]
        pub fn create_escrow(&mut self, chef: AccountId) -> Result<u32> {
            let customer = self.env().caller();
            let amount = self.env().transferred_value();

            if amount == 0 {
                return Err(Error::InsufficientFunds);
            }

            let escrow_id = self.next_escrow_id;
            let release_time = self.env().block_timestamp() + THIRTY_DAYS;

            let details = EscrowDetails {
                customer,
                chef,
                amount,
                release_time,
                status: EscrowStatus::InProgress,
            };

            self.escrows.insert(escrow_id, &details);
            self.next_escrow_id += 1;

            Ok(escrow_id)
        }

        /// Releases the funds for a specific escrow to the chef after the 30-day period.
        ///
        /// This can only be called by the `chef`.
        #[ink(message)]
        pub fn release_funds(&mut self, escrow_id: u32) -> Result<()> {
            let mut details = self.escrows.get(escrow_id).ok_or(Error::EscrowNotFound)?;

            let caller = self.env().caller();
            if caller != details.chef {
                return Err(Error::NotTheChef);
            }

            if details.status != EscrowStatus::InProgress {
                return Err(Error::EscrowFinished);
            }

            let current_time = self.env().block_timestamp();
            if current_time < details.release_time {
                return Err(Error::EscrowNotExpired);
            }

            if self.env().transfer(details.chef, details.amount).is_err() {
                return Err(Error::TransferFailed);
            }

            details.status = EscrowStatus::Completed;
            self.escrows.insert(escrow_id, &details);
            Ok(())
        }

        /// Returns the current status of the escrow.
        #[ink(message)]
        pub fn get_escrow_status(&self, escrow_id: u32) -> Option<EscrowStatus> {
            self.escrows.get(escrow_id).map(|d| d.status)
        }

        /// Returns the release time of the escrow.
        #[ink(message)]
        pub fn get_escrow_release_time(&self, escrow_id: u32) -> Option<Timestamp> {
            self.escrows.get(escrow_id).map(|d| d.release_time)
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink::env::test;

        /// We test if the default constructor does its job.
        #[ink::test]
        fn default_works() {
            let escrow = Escrow::new();
            assert_eq!(escrow.next_escrow_id, 0);
        }

        /// We test a simple use case of our contract.
        #[ink::test]
        fn it_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut escrow = Escrow::new();

            // Set the balance for the transaction.
            test::set_account_balance::<ink::env::DefaultEnvironment>(
                test::get_current_account_id(),
                1000,
            );
            // Set the value transferred for the constructor.
            test::set_block_timestamp::<ink::env::DefaultEnvironment>(1);
            test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            test::set_callee::<ink::env::DefaultEnvironment>(test::get_current_account_id());
            test::set_transferred_value::<ink::env::DefaultEnvironment>(1000);

            let escrow_id = escrow.create_escrow(accounts.bob).unwrap();
            assert_eq!(escrow_id, 0);
            assert_eq!(escrow.get_escrow_status(0), Some(EscrowStatus::InProgress));

            // The release time should be in the future.
            assert!(escrow.get_escrow_release_time(0).unwrap() > ink::env::block_timestamp());

            // Set the caller to the chef.
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);

            // Releasing before the time should fail.
            assert_eq!(escrow.release_funds(0), Err(Error::EscrowNotExpired));

            // Advance the block time by 31 days.
            ink::env::test::advance_block_time::<ink::env::DefaultEnvironment>(THIRTY_DAYS + 1);

            // Now, releasing should succeed.
            assert_eq!(escrow.release_funds(0), Ok(()));
            assert_eq!(escrow.get_escrow_status(0), Some(EscrowStatus::Completed));
        }
    }

    #[cfg(all(test, feature = "e2e-tests"))]
    mod e2e_tests {
        use super::*;

        type E2EResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;

        #[ink_e2e::test]
        async fn new_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            let constructor = EscrowRef::new();

            let contract = client
                .instantiate("escrow", &ink_e2e::alice(), constructor)
                .submit()
                .await
                .expect("instantiate failed");
            let call_builder = contract.call_builder::<Escrow>();

            let next_id = client
                .call(&ink_e2e::alice(), &call_builder.next_escrow_id())
                .dry_run()
                .await?
                .return_value();

            assert_eq!(next_id, 0);

            Ok(())
        }

        #[ink_e2e::test]
        async fn it_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            let constructor = EscrowRef::new();
            let contract = client
                .instantiate("escrow", &ink_e2e::alice(), constructor)
                .submit()
                .await
                .expect("instantiate failed");
            let call_builder = contract.call_builder::<Escrow>();

            let accounts = ink_e2e::accounts();

            // Create an escrow
            let create_call = call_builder.create_escrow(accounts.bob);
            let escrow_id = client
                .call(&ink_e2e::alice(), &create_call)
                .value(1000)
                .dry_run()
                .await?
                .return_value()
                .unwrap();

            assert_eq!(escrow_id, 0);

            // Only chef can try to release
            let release_call = call_builder.release_funds(escrow_id);
            let release_result = client
                .call(&ink_e2e::bob(), &release_call)
                .dry_run()
                .await
                .unwrap_err();

            // This is a bit of a hack to check for the specific error
            // as ink_e2e doesn't decode contract-specific errors yet.
            assert!(release_result.to_string().contains("EscrowNotExpired"));

            // TODO: Find a way to advance time in e2e tests.
            // For now, we can't test the successful release path in e2e.

            Ok(())
        }
    }
}
