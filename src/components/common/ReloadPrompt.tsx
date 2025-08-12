import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from './Button'

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (offlineReady) {
    return (
      <div className="fixed right-0 bottom-0 m-4 p-4 border rounded-lg bg-card shadow-lg z-50">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold">App ready to work offline</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => close()}>X</Button>
        </div>
      </div>
    )
  }

  if (needRefresh) {
    return (
      <div className="fixed right-0 bottom-0 m-4 p-4 border rounded-lg bg-card shadow-lg z-50">
        <div className="flex-1 mb-2">
          <h3 className="font-bold">New version available!</h3>
          <p className="text-sm text-muted-foreground">Reload to update the application.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => updateServiceWorker(true)}>Reload</Button>
          <Button variant="outline" onClick={() => close()}>Not now</Button>
        </div>
      </div>
    )
  }

  return null
}

export default ReloadPrompt
