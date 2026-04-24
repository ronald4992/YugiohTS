import { useState, useEffect, useRef } from "react";
import "./style.css";

interface CardImage {
  image_url: string;
  image_url_small: string;
}

interface Card {
  id: number;
  name: string;
  type: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race: string;
  attribute?: string;
  archetype?: string;
  card_images: CardImage[];
}

const MAX_CARTAS_MAZO = 40;
const MIN_CARTAS_MAZO = 20;

function getBadgeClass(type: string): string {
  if (type.includes("Monster")) return "badge badge-monster";
  if (type === "Spell Card") return "badge badge-spell";
  if (type === "Trap Card") return "badge badge-trap";
  return "badge badge-other";
}

function getBadgeLabel(type: string): string {
  if (type.includes("Monster")) return "Monstruo";
  if (type === "Spell Card") return "Magia";
  if (type === "Trap Card") return "Trampa";
  return type;
}

function Original() {
  const [todasCartas, setTodasCartas]   = useState<Card[]>([]);
  const [resultados, setResultados]     = useState<Card[]>([]);
  const [mazo, setMazo]                 = useState<Card[]>([]);
  const [busqueda, setBusqueda]         = useState("");
  const [cargando, setCargando]         = useState(true);
  const [modalCard, setModalCard]       = useState<Card | null>(null);
  const [nombreMazo, setNombreMazo]     = useState("Mi Mazo");
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [vistaActiva, setVistaActiva]   = useState<"buscador" | "mazo">("buscador");
  const [toast, setToast]               = useState("");
  const busquedaRef = useRef<HTMLInputElement>(null);

  // ─── Fetch ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchCartas = async () => {
      try {
        const res  = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?num=100&offset=0");
        const data = await res.json();
        setTodasCartas(data.data ?? []);
      } catch (e) {
        console.error("Error:", e);
      } finally {
        setCargando(false);
      }
    };
    fetchCartas();

    const mazoGuardado = localStorage.getItem("mazo_yugioh");
    const nombreGuardado = localStorage.getItem("mazo_nombre");
    if (mazoGuardado) setMazo(JSON.parse(mazoGuardado));
    if (nombreGuardado) setNombreMazo(nombreGuardado);
  }, []);

  // ─── Búsqueda ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (busqueda.length < 2) { setResultados([]); return; }
    const q = busqueda.toLowerCase();
    setResultados(
      todasCartas.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 30)
    );
  }, [busqueda, todasCartas]);

  // ─── Búsqueda API extendida ───────────────────────────────────────────────

  useEffect(() => {
    if (busqueda.length < 2) return;
    const timer = setTimeout(async () => {
      try {
        const res  = await fetch(
          `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(busqueda)}&num=30`
        );
        const data = await res.json();
        if (data.data) setResultados(data.data.slice(0, 30));
      } catch (_) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [busqueda]);

  // ─── Mazo helpers ────────────────────────────────────────────────────────

  const mostrarToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const agregarAlMazo = (card: Card) => {
    if (mazo.length >= MAX_CARTAS_MAZO) {
      mostrarToast("El mazo ya tiene el máximo de 60 cartas");
      return;
    }
    const copias = mazo.filter((c) => c.id === card.id).length;
    if (copias >= 3) {
      mostrarToast("Máximo 3 copias por carta");
      return;
    }
    const nuevo = [...mazo, card];
    setMazo(nuevo);
    localStorage.setItem("mazo_yugioh", JSON.stringify(nuevo));
    mostrarToast(`${card.name} agregada`);
  };

  const quitarDelMazo = (index: number) => {
    const nuevo = mazo.filter((_, i) => i !== index);
    setMazo(nuevo);
    localStorage.setItem("mazo_yugioh", JSON.stringify(nuevo));
  };

  const limpiarMazo = () => {
    setMazo([]);
    localStorage.removeItem("mazo_yugioh");
    mostrarToast("Mazo vaciado");
  };

  const guardarNombre = (nombre: string) => {
    setNombreMazo(nombre);
    localStorage.setItem("mazo_nombre", nombre);
    setEditandoNombre(false);
  };

  // ─── Stats del mazo ───────────────────────────────────────────────────────

  const monstruos  = mazo.filter((c) => c.type.includes("Monster")).length;
  const magias     = mazo.filter((c) => c.type === "Spell Card").length;
  const trampas    = mazo.filter((c) => c.type === "Trap Card").length;
  const valido     = mazo.length >= MIN_CARTAS_MAZO && mazo.length <= MAX_CARTAS_MAZO;

  // ─── Cartas únicas en mazo (para mostrar con cantidad) ──────────────────

  const mazoContado = mazo.reduce<{ card: Card; cantidad: number }[]>((acc, card) => {
    const existe = acc.find((e) => e.card.id === card.id);
    if (existe) { existe.cantidad++; }
    else { acc.push({ card, cantidad: 1 }); }
    return acc;
  }, []);

  // ─── Modal ────────────────────────────────────────────────────────────────

  const renderModal = () => {
    if (!modalCard) return null;
    const img = modalCard.card_images?.[0]?.image_url;
    const enMazo = mazo.filter((c) => c.id === modalCard.id).length;

    return (
      <div className="modal-overlay" onClick={() => setModalCard(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          {img && <img src={img} alt={modalCard.name} className="modal-img" />}
          <div className="modal-info">
            <button className="modal-close" onClick={() => setModalCard(null)}>
              ✕ Cerrar
            </button>
            <h2 className="modal-name">{modalCard.name}</h2>
            <span className={getBadgeClass(modalCard.type)}>
              {getBadgeLabel(modalCard.type)}
            </span>
            <div className="modal-rows">
              {modalCard.attribute && (
                <div className="modal-row">
                  <span className="modal-label">Atributo</span>
                  <span>{modalCard.attribute}</span>
                </div>
              )}
              {modalCard.race && (
                <div className="modal-row">
                  <span className="modal-label">Raza</span>
                  <span>{modalCard.race}</span>
                </div>
              )}
              {modalCard.level && (
                <div className="modal-row">
                  <span className="modal-label">Nivel</span>
                  <span>{modalCard.level}</span>
                </div>
              )}
              {modalCard.archetype && (
                <div className="modal-row">
                  <span className="modal-label">Arquetipo</span>
                  <span>{modalCard.archetype}</span>
                </div>
              )}
            </div>
            {(modalCard.atk !== undefined || modalCard.def !== undefined) && (
              <div className="modal-stats">
                {modalCard.atk !== undefined && (
                  <div className="modal-stat">
                    <span className="stat-val">{modalCard.atk}</span>
                    <span className="stat-lbl">ATK</span>
                  </div>
                )}
                {modalCard.def !== undefined && (
                  <div className="modal-stat">
                    <span className="stat-val">{modalCard.def}</span>
                    <span className="stat-lbl">DEF</span>
                  </div>
                )}
              </div>
            )}
            <p className="modal-desc">{modalCard.desc}</p>
            <div className="modal-acciones">
              <span className="modal-en-mazo">
                En mazo: <strong>{enMazo}/3</strong>
              </span>
              <button
                className="btn-agregar"
                onClick={() => { agregarAlMazo(modalCard); setModalCard(null); }}
                disabled={enMazo >= 3 || mazo.length >= MAX_CARTAS_MAZO}
              >
                + Agregar al mazo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  if (cargando) {
    return (
      <div className="loader">
        <div className="spinner" />
        <p>Cargando cartas...</p>
      </div>
    );
  }

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={vistaActiva === "buscador" ? "tab activo" : "tab"}
          onClick={() => { setVistaActiva("buscador"); setTimeout(() => busquedaRef.current?.focus(), 100); }}
        >
          Buscador de cartas
        </button>
        <button
          className={vistaActiva === "mazo" ? "tab activo" : "tab"}
          onClick={() => setVistaActiva("mazo")}
        >
          Mi mazo
          <span className={`tab-badge ${valido ? "valido" : ""}`}>
            {mazo.length}
          </span>
        </button>
      </div>

      {/* ── Vista Buscador ─────────────────────────────────────────────────── */}
      {vistaActiva === "buscador" && (
        <div className="vista-buscador">
          <input
            ref={busquedaRef}
            type="text"
            className="buscador-input"
            placeholder="Escribe el nombre de una carta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoFocus
          />

          {busqueda.length < 2 && (
            <div className="buscador-hint">
              <p>Escribe al menos 2 caracteres para buscar cartas.</p>
              <p>Puedes agregar hasta 3 copias de cada carta y un máximo de 40 en total y un minimo de 20.</p>
            </div>
          )}

          {busqueda.length >= 2 && resultados.length === 0 && (
            <div className="buscador-hint">
              <p>No se encontraron cartas con ese nombre.</p>
            </div>
          )}

          <div className="resultados-grid">
            {resultados.map((card) => {
              const img     = card.card_images?.[0]?.image_url_small;
              const enMazo  = mazo.filter((c) => c.id === card.id).length;
              return (
                <div key={card.id} className="result-card">
                  <div className="result-img-wrap" onClick={() => setModalCard(card)}>
                    {img && <img src={img} alt={card.name} className="result-img" loading="lazy" />}
                    {enMazo > 0 && (
                      <span className="result-badge-mazo">{enMazo}x</span>
                    )}
                  </div>
                  <div className="result-body">
                    <p className="result-name" onClick={() => setModalCard(card)}>{card.name}</p>
                    <p className="result-meta">{card.race}</p>
                    <span className={getBadgeClass(card.type)}>{getBadgeLabel(card.type)}</span>
                    <button
                      className="btn-add-small"
                      onClick={() => agregarAlMazo(card)}
                      disabled={enMazo >= 3 || mazo.length >= MAX_CARTAS_MAZO}
                    >
                      {enMazo >= 3 ? "Máx." : "+ Mazo"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Vista Mazo ────────────────────────────────────────────────────── */}
      {vistaActiva === "mazo" && (
        <div className="vista-mazo">

          {/* Nombre del mazo */}
          <div className="mazo-nombre-row">
            {editandoNombre ? (
              <input
                className="mazo-nombre-input"
                defaultValue={nombreMazo}
                autoFocus
                onBlur={(e) => guardarNombre(e.target.value || "Mi Mazo")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") guardarNombre((e.target as HTMLInputElement).value || "Mi Mazo");
                  if (e.key === "Escape") setEditandoNombre(false);
                }}
              />
            ) : (
              <h2 className="mazo-nombre" onClick={() => setEditandoNombre(true)}>
                {nombreMazo}
                <span className="mazo-nombre-edit">editar</span>
              </h2>
            )}
          </div>

          {/* Stats del mazo */}
          <div className="mazo-stats">
            <div className="mazo-stat-box">
              <span className="mazo-stat-val">{mazo.length}</span>
              <span className="mazo-stat-lbl">Total</span>
            </div>
            <div className="mazo-stat-box">
              <span className="mazo-stat-val" style={{ color: "#faeeda" }}>{monstruos}</span>
              <span className="mazo-stat-lbl">Monstruos</span>
            </div>
            <div className="mazo-stat-box">
              <span className="mazo-stat-val" style={{ color: "#eaf3de" }}>{magias}</span>
              <span className="mazo-stat-lbl">Magias</span>
            </div>
            <div className="mazo-stat-box">
              <span className="mazo-stat-val" style={{ color: "#fbeaf0" }}>{trampas}</span>
              <span className="mazo-stat-lbl">Trampas</span>
            </div>
          </div>

          {/* Barra de validez */}
          <div className="mazo-validez">
            <div className="validez-barra-bg">
              <div
                className="validez-barra-fill"
                style={{
                  width: `${Math.min((mazo.length / MAX_CARTAS_MAZO) * 100, 100)}%`,
                  backgroundColor: valido ? "#27500a" : mazo.length > MAX_CARTAS_MAZO ? "#7c1010" : "#185fa5",
                }}
              />
            </div>
            <div className="validez-info">
              <span className={`validez-label ${valido ? "ok" : ""}`}>
                {valido
                  ? "Mazo válido"
                  : mazo.length < MIN_CARTAS_MAZO
                  ? `Faltan ${MIN_CARTAS_MAZO - mazo.length} cartas para ser válido`
                  : `Excede el límite por ${mazo.length - MAX_CARTAS_MAZO}`}
              </span>
              <span className="validez-rango">{MIN_CARTAS_MAZO}–{MAX_CARTAS_MAZO} cartas</span>
            </div>
          </div>

          {/* Acciones */}
          {mazo.length > 0 && (
            <div className="mazo-acciones">
              <button className="btn-limpiar-mazo" onClick={limpiarMazo}>
                Vaciar mazo
              </button>
            </div>
          )}

          {/* Lista de cartas */}
          {mazo.length === 0 ? (
            <div className="mazo-vacio">
              <p>Tu mazo está vacío.</p>
              <span>Busca cartas y agrégalas desde el buscador.</span>
              <button className="btn-ir-buscador" onClick={() => setVistaActiva("buscador")}>
                Ir al buscador
              </button>
            </div>
          ) : (
            <div className="mazo-lista">
              {mazoContado.map(({ card, cantidad }) => {
                const img = card.card_images?.[0]?.image_url_small;
                return (
                  <div key={card.id} className="mazo-item">
                    <div className="mazo-item-img-wrap" onClick={() => setModalCard(card)}>
                      {img && <img src={img} alt={card.name} className="mazo-item-img" loading="lazy" />}
                    </div>
                    <div className="mazo-item-info">
                      <p className="mazo-item-name">{card.name}</p>
                      <p className="mazo-item-meta">{card.race}</p>
                      <span className={getBadgeClass(card.type)}>{getBadgeLabel(card.type)}</span>
                    </div>
                    <div className="mazo-item-controles">
                      <span className="mazo-item-cantidad">{cantidad}x</span>
                      <button
                        className="btn-ctrl"
                        onClick={() => agregarAlMazo(card)}
                        disabled={cantidad >= 3 || mazo.length >= MAX_CARTAS_MAZO}
                      >
                        +
                      </button>
                      <button
                        className="btn-ctrl btn-ctrl-minus"
                        onClick={() => {
                          const idx = mazo.map((c) => c.id).lastIndexOf(card.id);
                          if (idx !== -1) quitarDelMazo(idx);
                        }}
                      >
                        −
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {renderModal()}
    </>
  );
}

export default Original;