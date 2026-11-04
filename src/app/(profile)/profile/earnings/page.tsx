import { Wallet } from 'lucide-react'
import React from 'react'
import { AccountBalance } from './_components/Balance'
import TransactionsContainer from './_components/TransactionsContainer'

function EarningPage() {
    return (
        <div>

            <div className='mb-5 md:mb-6 lg:mb-8'>
                <div className="flex items-center gap-1.5">
                    <Wallet className="h-6 w-6 text-muted-foreground" />
                    <h3 className="text-xl font-semibold text-foreground">
                        Wallet
                    </h3>
                </div>
                <p className="mt-1 text-sm text-gray-700 max-w-2xl">
                    View your earnings and manage your wallet. Keep track of your financial transactions, monitor your balance, and stay informed about your payment history.
                </p>
            </div>

            <div className='max-w-2xl space-y-8 lg:space-y-10'>

                <AccountBalance />

                <TransactionsContainer />


            </div>

        </div>
    )
}

export default EarningPage