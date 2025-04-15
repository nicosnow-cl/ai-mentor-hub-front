import { MenuButton } from '../MenuButton'
import { ResetButton } from '../ResetButton'

export function Actions() {
  return (
    <div className="absolute right-4">
      <ResetButton />
      <MenuButton />
    </div>
  )
}
