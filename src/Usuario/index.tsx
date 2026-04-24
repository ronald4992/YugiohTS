import { useState, useEffect } from "react";
import "./style.css";

interface Usuario {
  nombre: string;
  invocador: string;
  descripcion: string;
}

const RANGOS = [
  { min: 0,   max: 9,   nombre: "Novato",        color: "#555" },
  { min: 10,  max: 24,  nombre: "Duelista",      color: "#27500a" },
  { min: 25,  max: 49,  nombre: "Invocador",     color: "#185fa5" },
  { min: 50,  max: 99,  nombre: "Maestro",       color: "#633806" },
  { min: 100, max: 999, nombre: "Rey de Juegos", color: "#7c3aed" },
];

function getRango(favoritos: number) {
  return RANGOS.find((r) => favoritos >= r.min && favoritos <= r.max) ?? RANGOS[0];
}

const USUARIO_DEFAULT: Usuario = {
  nombre: "",
  invocador: "",
  descripcion: "",
};

function getIniciales(nombre: string): string {
  return nombre
    .trim()
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Usuario() {
  const [usuario, setUsuario] = useState<Usuario>(USUARIO_DEFAULT);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<Usuario>(USUARIO_DEFAULT);
  const [totalFavoritos, setTotalFavoritos] = useState(0);
  const [guardado, setGuardado] = useState(false);

  // ─── Cargar datos ───────────────────────────────────────────────────────

  useEffect(() => {
    const stored = localStorage.getItem("usuario_yugioh");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUsuario(parsed);
      setForm(parsed);
    } else {
      setEditando(true);
    }

    const favs: unknown[] = JSON.parse(localStorage.getItem("favoritos_yugioh") || "[]");
    setTotalFavoritos(favs.length);
  }, []);

  // ─── Guardar ────────────────────────────────────────────────────────────

  const guardar = () => {
    if (!form.nombre.trim()) return;
    localStorage.setItem("usuario_yugioh", JSON.stringify(form));
    setUsuario(form);
    setEditando(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const cancelar = () => {
    setForm(usuario);
    setEditando(false);
  };

  const rango = getRango(totalFavoritos);

  // ─── Render edición ─────────────────────────────────────────────────────

  if (editando) {
    return (
      <>
        <div className="usr-header">
          <h1 className="usr-titulo">
            {usuario.nombre ? "Editar perfil" : "Crear perfil"}
          </h1>
        </div>

        <div className="usr-form-card">

          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-input"
              placeholder="Tu nombre real"
              value={form.nombre}
              maxLength={30}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nombre de invocador</label>
            <input
              type="text"
              className="form-input"
              placeholder="Tu alias de duelista"
              value={form.invocador}
              maxLength={30}
              onChange={(e) => setForm({ ...form, invocador: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Cuéntanos sobre ti o tu estilo de juego..."
              value={form.descripcion}
              maxLength={150}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
            <span className="form-counter">{form.descripcion.length}/150</span>
          </div>

          <div className="form-acciones">
            {usuario.nombre && (
              <button className="btn-cancelar" onClick={cancelar}>
                Cancelar
              </button>
            )}
            <button
              className="btn-guardar"
              onClick={guardar}
              disabled={!form.nombre.trim()}
            >
              Guardar perfil
            </button>
          </div>
        </div>
      </>
    );
  }

  // ─── Render perfil ──────────────────────────────────────────────────────

  return (
    <>
      <div className="usr-header">
        <h1 className="usr-titulo">Mi perfil</h1>
        <button className="btn-editar" onClick={() => setEditando(true)}>
          Editar
        </button>
      </div>

      {guardado && (
        <div className="usr-toast">Perfil guardado correctamente</div>
      )}

      {/* Tarjeta principal */}
      <div className="usr-card">
        <div className="usr-iniciales">
          {getIniciales(usuario.nombre)}
        </div>
        <div className="usr-info">
          <h2 className="usr-nombre">{usuario.nombre}</h2>
          {usuario.invocador && (
            <p className="usr-invocador">"{usuario.invocador}"</p>
          )}
          {usuario.descripcion && (
            <p className="usr-desc">{usuario.descripcion}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="usr-stats">
        <div className="stat-box">
          <span className="stat-val">{totalFavoritos}</span>
          <span className="stat-lbl">Cartas favoritas</span>
        </div>
        <div className="stat-box">
          <span className="stat-val" style={{ color: rango.color }}>
            {rango.nombre}
          </span>
          <span className="stat-lbl">Rango actual</span>
        </div>
        <div className="stat-box">
          <span className="stat-val">{rango.max === 999 ? "Max" : rango.max - totalFavoritos}</span>
          <span className="stat-lbl">Para siguiente rango</span>
        </div>
      </div>

      {/* Progreso */}
      <div className="usr-progreso-card">
        <div className="progreso-header">
          <span className="progreso-label">Progreso de rango</span>
          <span className="progreso-rango" style={{ color: rango.color }}>
            {rango.nombre}
          </span>
        </div>
        <div className="progreso-barra-bg">
          <div
            className="progreso-barra-fill"
            style={{
              width: `${Math.min(
                ((totalFavoritos - rango.min) / (rango.max - rango.min)) * 100,
                100
              )}%`,
              backgroundColor: rango.color,
            }}
          />
        </div>
        <div className="progreso-info">
          <span>{totalFavoritos} favoritos</span>
          <span>Siguiente rango: {rango.max === 999 ? "Max" : rango.max + 1}</span>
        </div>

        {/* Lista de rangos */}
        <div className="rangos-lista">
          {RANGOS.map((r) => (
            <div
              key={r.nombre}
              className={`rango-item${rango.nombre === r.nombre ? " activo" : ""}`}
            >
              <div className="rango-dot" style={{ backgroundColor: r.color }} />
              <span
                className="rango-nombre"
                style={{ color: rango.nombre === r.nombre ? r.color : "#444" }}
              >
                {r.nombre}
              </span>
              <span className="rango-req">
                {r.min}–{r.max === 999 ? "Inf" : r.max} favoritos
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Usuario;