import { useEffect, useState } from "react";
import "./style.css";

interface CardImage {
  image_url: string;
  image_url_small: string;
}

interface CardPrice {
  tcgplayer_price: string;
}

interface BanlistInfo {
  ban_tcg?: string;
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

function Favorito() {
  const [favoritos, setFavoritos] = useState<Card[]>([]);
  const [modalCard, setModalCard] = useState<Card | null>(null);

  const cargarFavoritos = () => {
    const stored: Card[] = JSON.parse(
      localStorage.getItem("favoritos_yugioh") || "[]"
    );
    setFavoritos(stored);
  };

  useEffect(() => {
    cargarFavoritos();
    window.addEventListener("storage", cargarFavoritos);
    return () => window.removeEventListener("storage", cargarFavoritos);
  }, []);

  const agregarFavorito = (card: Card) => {
    const stored: Card[] = JSON.parse(
      localStorage.getItem("favoritos_yugioh") || "[]"
    );

    if (stored.some((c) => c.id === card.id)) return;

    const nuevos = [...stored, card];
    localStorage.setItem("favoritos_yugioh", JSON.stringify(nuevos));
    setFavoritos(nuevos);
  };

  const eliminarFavorito = (id: number) => {
    const nuevos = favoritos.filter((c) => c.id !== id);
    localStorage.setItem("favoritos_yugioh", JSON.stringify(nuevos));
    setFavoritos(nuevos);

    if (modalCard?.id === id) setModalCard(null);
  };

  const toggleFavorito = (card: Card) => {
    if (favoritos.some((c) => c.id === card.id)) {
      eliminarFavorito(card.id);
    } else {
      agregarFavorito(card);
    }
  };

  const limpiarTodo = () => {
    setFavoritos([]);
    localStorage.removeItem("favoritos_yugioh");
    setModalCard(null);
  };

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

            <h2>{modalCard.name}</h2>

            <button
              className="btn-fav"
              onClick={() => toggleFavorito(modalCard)}
            >
              {favoritos.some((c) => c.id === modalCard.id)
                ? "★ Quitar de favoritos"
                : "☆ Agregar a favoritos"}
            </button>

            <p>{modalCard.desc}</p>
            <p>Precio: {precio !== "N/D" ? `$${precio}` : "N/D"}</p>
            <p>Ban: {ban}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fav-header">
        <h1>Favoritos</h1>

        {favoritos.length > 0 && (
          <button onClick={limpiarTodo}>Limpiar todo</button>
        )}
      </div>

      {favoritos.length === 0 ? (
        <p>No tienes cartas favoritas.</p>
      ) : (
        <div className="cards-grid">
          {favoritos.map((card) => {
            const imgUrl = card.card_images?.[0]?.image_url_small;
            const esFavorito = favoritos.some((c) => c.id === card.id);

            return (
              <div
                key={card.id}
                className="card-item"
                onClick={() => setModalCard(card)}
              >
                {imgUrl && <img src={imgUrl} alt={card.name} />}

                <p>{card.name}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorito(card);
                  }}
                >
                  {esFavorito ? "★" : "☆"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {renderModal()}
    </>
  );
}

export default Favorito;