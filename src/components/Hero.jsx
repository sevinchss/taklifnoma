// Birinchi ekran: eshik ochilishining oxirgi kadri (Intro bilan aynan bir xil kompozitsiya).
// `ready` — kirish tugadi: shundan keyin jonli fon (yulduzlar, nur, tuman, zarrachalar) yoqiladi.
import { Scene } from './Intro'
import { WEDDING } from '../config'

export default function Hero({ ready }) {
  return (
    <section className="relative h-[100svh] overflow-hidden" aria-label="Taklifnoma muqovasi">
      <Scene phase="open" live={ready} hero />
      <h1 className="sr-only">
        {WEDDING.groom} va {WEDDING.bride} — nikoh to'yiga taklifnoma
      </h1>
    </section>
  )
}
