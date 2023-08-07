import { useEffect } from 'react'
import { useContractEvent } from 'wagmi'
import { oddsWatcher } from '../modules/oddsWatcher'
import { useChain } from './useChain'


export const useOddsWatcher = () => {
  const { appChainId, contracts } = useChain()

  const unwatchSingle = useContractEvent({
    address: contracts.prematchCore.address,
    abi: contracts.prematchCore.abi,
    eventName: 'NewBet',
    listener(log) {
      // @ts-ignore
      const conditionId = log.args.conditionId!

      oddsWatcher.dispatch(appChainId, conditionId)
    },
  })

  const unwatchCombo = useContractEvent({
    address: contracts.prematchCore.address,
    abi: contracts.prematchCore.abi,
    eventName: 'OddsChanged',
    listener(log) {
      // @ts-ignore
      const conditionId = log.args.conditionId!

      oddsWatcher.dispatch(appChainId, conditionId)
    },
  })

  useEffect(() => {

    return () => {
      unwatchSingle?.()
      unwatchCombo?.()
    }
  }, [ unwatchSingle, unwatchCombo ])
}
