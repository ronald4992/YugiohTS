import "./style.css";

const secciones = [
  {
    titulo: "¿Qué es Yu-Gi-Oh!?",
    contenido:
      "Yu-Gi-Oh! es un juego de cartas coleccionables creado por Kazuki Takahashi en 1996. Basado en el manga y anime del mismo nombre, el juego enfrenta a dos duelistas que usan mazos de cartas para reducir los puntos de vida del oponente de 8000 a 0.",
  },
  {
    titulo: "Tipos de cartas",
    contenido:
      "Existen tres categorías principales: Monstruos, Magia y Trampa. Los monstruos se invocan para atacar y defender. Las cartas de Magia otorgan efectos especiales instantáneos. Las Trampas se activan en respuesta a las acciones del oponente.",
  },
  {
    titulo: "Atributos de monstruo",
    contenido:
      "Cada monstruo tiene un atributo elemental que define su naturaleza: DARK (oscuridad), LIGHT (luz), EARTH (tierra), WATER (agua), FIRE (fuego), WIND (viento) y DIVINE (divino). Los atributos afectan compatibilidad con ciertos efectos y arquetipos.",
  },
  {
    titulo: "Tipos de invocación",
    contenido:
      "Además de la invocación normal, existen métodos especiales: Fusión (combina monstruos con Polymerization), Sincronía (suma niveles con un Sincronizador), XYZ (apila monstruos del mismo nivel), Péndulo (invoca masivamente desde la mano) y Enlace (usa flechas de enlace).",
  },
  {
    titulo: "ATK y DEF",
    contenido:
      "ATK representa la fuerza de ataque del monstruo. DEF es su defensa cuando está en posición de defensa. En un enfrentamiento, si el ATK del atacante supera el DEF del defensor, el monstruo defensor es destruido sin daño al duelista.",
  },
  {
    titulo: "La Lista de Prohibidos",
    contenido:
      "Konami publica periódicamente la Banlist, que regula las cartas más poderosas. Una carta puede estar Prohibida (0 copias), Limitada (1 copia) o Semi-Limitada (2 copias). El objetivo es mantener el equilibrio competitivo del juego.",
  },
  {
    titulo: "Arquetipos",
    contenido:
      "Un arquetipo es un grupo de cartas que comparten un nombre en común y están diseñadas para funcionar juntas. Ejemplos populares incluyen Blue-Eyes, Dark Magician, Eldlich, Tearlaments y Purrely. La mayoría de los mazos competitivos se construyen alrededor de un arquetipo.",
  },
  {
    titulo: "Formatos de juego",
    contenido:
      "TCG es el formato occidental (América y Europa). OCG es el formato asiático (Japón, Corea, etc.). Ambos tienen Banlists distintas y a veces reciben cartas en diferente orden. También existe el formato Speed Duel, una versión simplificada del juego.",
  },
];

const atributos: { nombre: string; color: string; texto: string; desc: string }[] = [
  { nombre: "DARK",   color: "#2d1b4e", texto: "#c084fc", desc: "Oscuridad y caos" },
  { nombre: "LIGHT",  color: "#3b3000", texto: "#fde68a", desc: "Luz y pureza" },
  { nombre: "EARTH",  color: "#1a2e1a", texto: "#86efac", desc: "Tierra y fuerza" },
  { nombre: "WATER",  color: "#0c2233", texto: "#7dd3fc", desc: "Agua y fluidez" },
  { nombre: "FIRE",   color: "#2e1000", texto: "#fb923c", desc: "Fuego y poder" },
  { nombre: "WIND",   color: "#1a2a1a", texto: "#a3e635", desc: "Viento y velocidad" },
  { nombre: "DIVINE", color: "#2e2200", texto: "#fcd34d", desc: "Poder divino" },
];

const tipos: { nombre: string; badge: string; badgeTexto: string; desc: string }[] = [
  { nombre: "Monstruo de Efecto", badge: "#faeeda", badgeTexto: "#633806", desc: "Tiene un efecto especial activable." },
  { nombre: "Monstruo Normal",    badge: "#faeeda", badgeTexto: "#633806", desc: "Sin efecto, pero con alto ATK/DEF." },
  { nombre: "Carta de Magia",     badge: "#eaf3de", badgeTexto: "#27500a", desc: "Efecto inmediato o continuo." },
  { nombre: "Carta de Trampa",    badge: "#fbeaf0", badgeTexto: "#4b1528", desc: "Se activa en respuesta a acciones." },
  { nombre: "Fusión",             badge: "#faeeda", badgeTexto: "#633806", desc: "Invocado combinando monstruos." },
  { nombre: "Sincronía",          badge: "#faeeda", badgeTexto: "#633806", desc: "Suma de niveles con Sincronizador." },
  { nombre: "XYZ",                badge: "#faeeda", badgeTexto: "#633806", desc: "Apila monstruos del mismo nivel." },
  { nombre: "Enlace",             badge: "#faeeda", badgeTexto: "#633806", desc: "Usa flechas de enlace direccionales." },
];

function Informativa() {
  return (
    <>
      {/* Hero */}
      <div className="info-hero">
        <h1 className="info-hero-titulo">Guía Yu-Gi-Oh!</h1>
        <p className="info-hero-sub">
          Todo lo que necesitas saber para entender el juego de cartas más icónico del mundo.
        </p>
      </div>

      {/* Atributos */}
      <section className="info-seccion">
        <h2 className="info-seccion-titulo">Atributos</h2>
        <div className="atrib-grid">
          {atributos.map((a) => (
            <div
              key={a.nombre}
              className="atrib-card"
              style={{ backgroundColor: a.color, borderColor: a.texto + "33" }}
            >
              <span className="atrib-nombre" style={{ color: a.texto }}>{a.nombre}</span>
              <span className="atrib-desc">{a.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tipos de carta */}
      <section className="info-seccion">
        <h2 className="info-seccion-titulo">Tipos de carta</h2>
        <div className="tipos-grid">
          {tipos.map((t) => (
            <div key={t.nombre} className="tipo-card">
              <span
                className="badge"
                style={{ backgroundColor: t.badge, color: t.badgeTexto }}
              >
                {t.nombre}
              </span>
              <p className="tipo-desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Secciones informativas */}
      <section className="info-seccion">
        <h2 className="info-seccion-titulo">Conceptos del juego</h2>
        <div className="conceptos-grid">
          {secciones.map((s) => (
            <div key={s.titulo} className="concepto-card">
              <h3 className="concepto-titulo">{s.titulo}</h3>
              <p className="concepto-texto">{s.contenido}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer info */}
      <div className="info-footer">
        <p>Datos proporcionados por <strong>YGOPRODeck API</strong> · Yu-Gi-Oh! es propiedad de Konami.</p>
      </div>
    </>
  );
}

export default Informativa;