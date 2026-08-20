# Copy

Words are design material. Half of what makes the product feel calm is that
the interface speaks plainly, once, and stops.

## Voice

- **Sentence case everywhere.** Titles, buttons, labels, tabs. Title Case is
  a tell that the text was decorated rather than written.
- **Small words, short sentences.** The default UI voice is one sentence of
  `text-sm`. If a thought needs three sentences, it probably belongs in the
  docs, linked.
- **Name things by what people control**, never by how the system is built. A
  person manages notifications, not webhook config; they check the install,
  not the ingest pipeline.
- **Specific beats clever.** "Day 3: Starter at $9/mo begins. Cancel before
  then and pay nothing." does more work than any slogan.

## Buttons

A control says exactly what happens, and keeps its name through the flow:

- "Save changes", then a toast that says "Saved". Never "Submit", "OK",
  "Confirm" alone.
- Destructive confirms name the object: "Delete site", not "Yes".
- A waiting button keeps its label next to the spinner ("Waiting…" only when
  waiting truly is the state).
- Escape hatches are honest: offer "I'll do this later" only when later is
  genuinely fine, and make it go somewhere real.

## Errors

An error names the cause and the way out, in the interface's voice:

- Never apologize, never exclaim, never blame. Not "Oops! Something went
  wrong!!" but "The plans didn't load. The billing page has them too."
- If the system is at fault, the copy owns it plainly; if an input is at
  fault, the field explains what would succeed.
- Report all field problems at once; fixing one at a time is a needlessly
  slow form.
- A refusal the user caused on purpose (a cancelled checkout) is reported
  once, without drama: "Checkout cancelled, nothing was charged."

## States and their sentences

- **Empty states are invitations**: one bold claim of the state, one plain
  sentence of what to do, one action. "No events yet. If the snippet is live,
  browse your site and we'll pick up the first pageview within seconds."
- **Waiting states say what is being awaited** and how long it usually takes:
  "This usually takes a few seconds." Only promise durations you measured.
- **Standing conditions describe the state, not the event**: "The last
  payment failed. Update your card" stays until the state ends, and ending
  the state is the dismissal.
- **Never claim what the system has not confirmed.** A checkout redirect is
  not a confirmation; say "Confirming your payment…" until the source of
  truth answers, then say what actually landed.

## Numbers and dates

- Tabular numerals in columns; compact notation for big counts ("1.2M
  events/mo"); real currency math on yearly toggles.
- Dates are absolute where a decision hangs on them ("ends Aug 26"), relative
  where rhythm matters ("2 minutes ago").
- A zero is shown as a zero only when it is a measurement; when nothing has
  ever been measured, say so instead of rendering fake certainty.
