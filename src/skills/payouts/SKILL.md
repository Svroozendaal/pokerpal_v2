# Skill: Payout Calculation

## When to Use
Use this skill when changing:
- how payouts are computed
- rounding/precision rules
- discrepancy detection behavior
- the format of payout strings shown to users

## Source of Truth (Code)
- `src/App.js`: `calculatePayouts`

## Inputs / State (Current)
The calculator uses:
- `players`: array of `{ name, startStack, endStack }` (stacks are user-entered and often stored as strings)
- `coinValue`: number (chip value -> money conversion)
- `selectedCurrency`: object with `symbol` (used for display)

## Algorithm (Current)
`calculatePayouts` does the following:
1. Normalizes empty `startStack`/`endStack` values to `"0"`.
2. Recomputes `totalStartingStack` and `totalEndingStack`.
3. If totals differ, shows a discrepancy modal with the discrepancy value converted using `coinValue`.
4. Computes per-player:
   - `startingValue = startStack * coinValue`
   - `endingValue = endStack * coinValue`
   - `result = endingValue - startingValue`
5. Builds a list of payout instructions by matching winners (result > 0) with losers (result < 0):
   - Greedy settlement: for each winner, iterate losers and transfer `min(winnerRemaining, abs(loserRemaining))`.
   - Produces strings like: `"<loser> should pay <winner> <symbol><amount>"`.
6. Stores `{ playerResults, payouts, currency }` into `results` state and opens the results dialog.

## Rounding / Precision Notes
- The code uses `parseFloat` and `toFixed(2)` for display.
- If you change money math, explicitly document rounding and equality expectations.

## Common Changes
- Change payout string format: update `calculatePayouts` and ensure `ResultsDisplay`/share features still match.
- Support alternative settlement strategies (min transactions, grouping): document tradeoffs and add tests if introduced.

## Debugging Checklist
- Reproduce with a small 2-player example (one winner/one loser).
- Test multi-player cases with multiple winners/losers.
- Verify discrepancy behavior when totals are off by small amounts (floating point).

