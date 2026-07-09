interface Props {
  /** e.g. "a TIME" — an article followed by the clue noun */
  clue: string
}

/** "the secret is a <strong>time</strong>" — the chip's small-caps CSS does the rest. */
export function ClueChip({ clue }: Props) {
  const [article, ...rest] = clue.trim().split(' ')
  const noun = rest.join(' ')

  return (
    <p className="clue-chip">
      the secret is {article.toLowerCase()} <strong>{noun.toLowerCase()}</strong>
    </p>
  )
}
