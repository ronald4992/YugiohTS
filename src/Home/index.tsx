import "./style.css";
import { useState, useEffect } from "react";


interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
}

interface CardPrice {
  tcgplayer_price: string;
  ebay_price: string;
  amazon_price: string;
  cardmarket_price: string;
}

interface BanlistInfo {
  ban_tcg?: string;
  ban_ocg?: string;
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
  card_prices: CardPrice[];
  banlist_info?: BanlistInfo;
}



type FiltroTipo =
  | "Todos"
  | "Effect Monster"
  | "Normal Monster"
  | "Spell Card"
  | "Trap Card"
  | "Fusion Monster"
  | "Synchro Monster"
  | "XYZ Monster"
  | "Link Monster";

type AtributoTipo =
  | "Todos"
  | "DARK"
  | "LIGHT"
  | "EARTH"
  | "WATER"
  | "FIRE"
  | "WIND"
  | "DIVINE";

const FILTROS: FiltroTipo[] = [
  "Todos",
  "Effect Monster",
  "Normal Monster",
  "Spell Card",
  "Trap Card",
  "Fusion Monster",
  "Synchro Monster",
  "XYZ Monster",
  "Link Monster",
];

const ATRIBUTOS: AtributoTipo[] = [
  "Todos",
  "DARK",
  "LIGHT",
  "EARTH",
  "WATER",
  "FIRE",
  "WIND",
  "DIVINE",
];

const PAGE_SIZE = 20;


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


function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [filtradas, setFiltradas] = useState<Card[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<FiltroTipo>("Todos");
  const [atributo, setAtributo] = useState<AtributoTipo>("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(0);
  const [modalCard, setModalCard] = useState<Card | null>(null);


  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(
          "https://db.ygoprodeck.com/api/v7/cardinfo.php?num=500&offset=0"
        );
        const data = await res.json();
        setCards(data.data ?? []);
      } catch (e) {
        console.error("Error cargando cartas:", e);
      } finally {
        setCargando(false);
      }
    };
    fetchCards();
  }, []);


  useEffect(() => {
    let resultado = cards;
    if (filtro !== "Todos") resultado = resultado.filter((c) => c.type === filtro);
    if (atributo !== "Todos") resultado = resultado.filter((c) => c.attribute === atributo);
    if (busqueda.length >= 2) {
      const q = busqueda.toLowerCase();
      resultado = resultado.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.desc.toLowerCase().includes(q)
      );
    }
    setFiltradas(resultado);
    setPagina(0);
  }, [cards, filtro, atributo, busqueda]);


  const totalPaginas = Math.ceil(filtradas.length / PAGE_SIZE);
  const paginadas = filtradas.slice(pagina * PAGE_SIZE, (pagina + 1) * PAGE_SIZE);

  const renderModal = () => {
    if (!modalCard) return null;
    const img = modalCard.card_images?.[0]?.image_url;
    const precio = modalCard.card_prices?.[0]?.tcgplayer_price ?? "N/D";
    const ban = modalCard.banlist_info?.ban_tcg ?? "Permitida";

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
              <div className="modal-row">
                <span className="modal-label">Precio TCG</span>
                <span>{precio !== "N/D" ? `$${precio}` : "N/D"}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Ban TCG</span>
                <span>{ban}</span>
              </div>
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
          </div>
        </div>
      </div>
    );
  };

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
      {/* Filtros tipo */}
      <div className="filtros">
        {FILTROS.map((f) => (
          <button
            key={f}
            className={filtro === f ? "activo" : ""}
            onClick={() => setFiltro(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Controles */}
      <div className="controles">
        <input
          type="text"
          placeholder="Buscar carta..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          value={atributo}
          onChange={(e) => setAtributo(e.target.value as AtributoTipo)}
        >
          {ATRIBUTOS.map((a) => (
            <option key={a} value={a}>
              {a === "Todos" ? "Todos los atributos" : a}
            </option>
          ))}
        </select>
      </div>

      {/* Stats bar */}
      <div className="stats-bar">
        <span className="stat-chip">
          Total DB: <strong>{cards.length}</strong>
        </span>
        <span className="stat-chip">
          Filtradas: <strong>{filtradas.length}</strong>
        </span>
        <span className="stat-chip">
          Página: <strong>{pagina + 1} / {totalPaginas || 1}</strong>
        </span>
      </div>

      {/* Grid */}
      <div className="cards-grid">
        {paginadas.map((card) => {
          const imgUrl = card.card_images?.[0]?.image_url_small;
          const resaltado =
            busqueda.length >= 2 &&
            card.name.toLowerCase().includes(busqueda.toLowerCase());

          return (
            <div
              key={card.id}
              className={`card-item${resaltado ? " resaltado" : ""}`}
              onClick={() => setModalCard(card)}
            >
              {imgUrl && (
                <img src={imgUrl} alt={card.name} className="card-img" loading="lazy" />
              )}
              <div className="card-body">
                <p className="card-name">{card.name}</p>
                <p className="card-meta">{card.race}</p>
                <span className={getBadgeClass(card.type)}>
                  {getBadgeLabel(card.type)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginación */}
      <div className="paginacion">
        <button
          disabled={pagina === 0}
          onClick={() => setPagina((p) => p - 1)}
        >
          ← Anterior
        </button>
        <span>
          {pagina + 1} / {totalPaginas || 1}
        </span>
        <button
          disabled={pagina >= totalPaginas - 1}
          onClick={() => setPagina((p) => p + 1)}
        >
          Siguiente →
        </button>
      </div>

      {renderModal()}
    </>
  );
}

export default Home;