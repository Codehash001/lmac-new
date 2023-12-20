import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function CustomConnectButton(){

    return(

        <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
          // Note: If your app doesn't use authentication, you can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');
  
          return (
            <div {...(!ready && { 'aria-hidden': true, 'style': { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
              {(() => {
                if (!connected) {
                  return (
                    <button onClick={openConnectModal} type="button" className="bg-gradient-to-r from-green-900 via-emerald-600 to-emerald-800 px-6 py-3 rounded-md hover:rounded-lg border border-white font-semibold">
                      Connect Wallet
                    </button>
    
                  );
                }
                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} type="button">
                      Wrong network
                    </button>
                  );
                }
                return (
                  <div style={{ display: 'flex', gap: 12 }}  className="bg-black px-6 py-3 rounded-md hover:rounded-lg border border-white font-semibold">
                    <button onClick={openChainModal} style={{ display: 'flex', alignItems: 'center' }} type="button">
                      {chain.hasIcon && (
                        <div style={{ background: chain.iconBackground, width: 12, height: 12, borderRadius: 999, overflow: 'hidden', marginRight: 4 }}>
                          {chain.iconUrl && (
                            <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 12, height: 12 }} />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>
                    <div className="border-r"></div>
                    <button onClick={openAccountModal} type="button">
                     {account.displayName}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    )
}