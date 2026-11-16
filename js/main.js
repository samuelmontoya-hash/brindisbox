const productos = [
  {n:'Cerveza lager 330 ml', c:'cerveza', p:6500, e:'🍺', i:'cerveza.jpg', d:'Bien fría, lista para tomar.'},
  {n:'Six pack artesanal', c:'cerveza', p:32000, e:'🍻', i:'sixpack.jpg', d:'Seis cervezas de productores locales.'},
  {n:'Aguardiente 375 ml', c:'licor', p:42000, e:'🥃', i:'aguardiente.jpg', d:'El clásico para la reunión.'},
  {n:'Ron añejo 375 ml', c:'licor', p:55000, e:'🥂', i:'ron.jpg', d:'Suave, para tomar solo o con hielo.'},
  {n:'Vino tinto 750 ml', c:'vino', p:48000, e:'🍷', i:'vino.jpg', d:'Malbec fácil de acompañar.'},
  {n:'Hielo 2 kg', c:'extras', p:7000, e:'🧊', i:'hielo.jpg', d:'Bolsa sellada para toda la noche.'},
  {n:'Gaseosa 1,5 L', c:'extras', p:6000, e:'🥤', i:'gaseosa.jpg', d:'Para mezclar sin ir a otro lado.'},
  {n:'Snacks surtidos', c:'extras', p:5000, e:'🥜', i:'snacks.jpg', d:'Papas, maní y más.'}
];
const cop = v => '$' + v.toLocaleString('es-CO');

// Verificación de edad
const gate = document.getElementById('age-gate');
if (sessionStorage.getItem('adulto') === '1') gate.classList.add('hide');
document.getElementById('age-yes').onclick = () => { sessionStorage.setItem('adulto','1'); gate.classList.add('hide'); };
document.getElementById('age-no').onclick = () => { location.href = 'https://www.google.com'; };

// Menú móvil
const btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
btn.onclick = () => { const o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o); };
nav.querySelectorAll('a').forEach(a => a.onclick = () => nav.classList.remove('open'));

// Catálogo con filtros
const grid = document.getElementById('grid');
function render(f){
  grid.innerHTML = productos.filter(p => f==='todos' || p.c===f).map(p => `
    <article class="card">
      <div class="ph"><span>${p.e}</span><img src="img/${p.i}" alt="${p.n}" onerror="this.remove()"></div>
      <div class="b"><h3>${p.n}</h3><p>${p.d}</p><p class="price">${cop(p.p)}</p></div>
    </article>`).join('');
}
document.querySelectorAll('.chip').forEach(c => c.onclick = () => {
  document.querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
  c.classList.add('on'); render(c.dataset.f);
});
render('todos');

// Expendedora interactiva
const slots = document.getElementById('slots'), screen = document.getElementById('screen');
productos.slice(0,6).forEach((p,i) => {
  const b = document.createElement('button');
  b.className = 'slot';
  b.innerHTML = `<span>${p.e}</span><small>A${i+1}</small>`;
  b.setAttribute('aria-label', `A${i+1}: ${p.n}, ${cop(p.p)}`);
  b.onclick = () => {
    document.querySelectorAll('.slot').forEach(s => s.classList.remove('sel'));
    b.classList.add('sel');
    screen.textContent = `A${i+1} · ${p.n} · ${cop(p.p)}`;
  };
  slots.appendChild(b);
});

// Formulario de contacto (se envía con Netlify Forms)
const form = document.getElementById('form'), out = document.getElementById('form-msg');
form.addEventListener('submit', async e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('#nombre,#correo,#msg').forEach(f => {
    const bad = !f.value.trim() || (f.type==='email' && !/^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle('err', bad); if (bad) ok = false;
  });
  if (!ok) {
    out.className = 'bad';
    out.textContent = 'Revisa los campos marcados: todos son obligatorios y el correo debe ser válido.';
    return;
  }
  out.className = ''; out.textContent = 'Enviando...';
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams(new FormData(form)).toString()
    });
    if (!res.ok) throw new Error(res.status);
    out.className = 'ok';
    out.textContent = 'Mensaje enviado. Te respondemos en menos de 24 horas.';
    form.reset();
  } catch (err) {
    out.className = 'bad';
    out.textContent = 'No se pudo enviar. Escríbenos por WhatsApp o inténtalo de nuevo en unos minutos.';
  }
});
