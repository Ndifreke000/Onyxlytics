use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod query_stats {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.total_queries = 0;
        counter.successful_queries = 0;
        Ok(())
    }

    pub fn record_query(ctx: Context<RecordQuery>, success: bool) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.total_queries += 1;
        if success {
            counter.successful_queries += 1;
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 16)]
    pub counter: Account<'info, QueryCounter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RecordQuery<'info> {
    #[account(mut)]
    pub counter: Account<'info, QueryCounter>,
    pub user: Signer<'info>,
}

#[account]
pub struct QueryCounter {
    pub total_queries: u64,
    pub successful_queries: u64,
}