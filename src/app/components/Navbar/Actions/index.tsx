import { MenuButton } from '../MenuButton'
import { ResetDialog } from '../ResetDialog'

export function Actions() {
  return (
    <div className="absolute right-4">
      <ResetDialog />
      <MenuButton />
    </div>
  )
}
