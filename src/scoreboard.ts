/**
 * Zapisuje uzyskany wynik.
 * Jeśli uzyskany wynik jest większy niż najgorszy wynik w tabeli, zostaje podmieniony.
 * 
 * @param mode - Tryb rozgywki w którym został uzyskany wynik
 * @param name - Nazwa wyniku
 * @param score - Wynik
 */
export const addToScoreboard = (mode: string, name: string, score: number) => {
    const scoreboard = readScoreboard(mode) as Array<{ name: string, score: number}>

    if(scoreboard.length < 12) scoreboard.push({ name: name, score: score })
    else if(scoreboard[0].score < score) scoreboard[0] = { name: name, score: score }

    window.localStorage.setItem(`${mode}SCB`, JSON.stringify(scoreboard))
}

/**
 * Zwraca tablicę z usyskanymi wynikami.
 * 
 * @param mode - Tryb rozgywki z której zostaną zwrócone wyniki
 * @returns Tablica z wynikami
 */
export const readScoreboard = (mode: string) => (JSON.parse(window.localStorage.getItem(mode + 'SCB') || '[  ]') as Array<{ name: string, score: number}>).sort((a, b) => a.score - b.score)