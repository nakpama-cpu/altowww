## Center submit buttons in verify modals

The shadcn `DialogFooter` defaults to `sm:justify-end`, which right-aligns the submit button on tablet and desktop. That override needs to be removed on both verify modals so the button stays centered at all breakpoints.

### Changes (src/pages/portal/Account.tsx)

1. **VerifyAddress modal** (line 382): change `<DialogFooter>` to `<DialogFooter className="sm:justify-center justify-center">`.
2. **VerifyDob modal** (line 540): same change.

Leave the `EditProfile` modal footer (line 685) untouched — the user only asked about the verify modals.

No other markup or logic changes.