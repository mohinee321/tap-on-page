// Elements
const tapBtn = document.getElementById('tapBtn');
const startScreen = document.getElementById('startScreen');
const modal1 = document.getElementById('modal1');
const modal2 = document.getElementById('modal2');
const modal1Next = document.getElementById('modal1Next');
const closeBtn = document.getElementById('closeBtn');
const heartsContainer = document.getElementById('hearts');

let heartsInterval = null; // track interval so we can stop it

// Helpers to open/close modals
function openModal(modalEl) {
  modalEl.classList.add('open');
  modalEl.setAttribute('aria-hidden', 'false');
}
function closeModal(modalEl) {
  modalEl.classList.remove('open');
  modalEl.setAttribute('aria-hidden', 'true');
}

// Create floating hearts (start when first modal opens)
function startHearts() {
  if (heartsInterval) return; // avoid duplicate intervals
  heartsInterval = setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'heart';
    // choose emoji (mix of purple heart and red heart)
    heart.textContent = Math.random() > 0.4 ? '💜' : '❤️';
    heart.style.left = Math.random() * 90 + 'vw';
    heart.style.fontSize = (12 + Math.random() * 28) + 'px';
    const duration = 3500 + Math.random()*2500;
    heart.style.animationDuration = duration + 'ms';
    heartsContainer.appendChild(heart);

    // remove after animation
    setTimeout(() => {
      heart.remove();
    }, duration + 50);
  }, 380);
}

function stopHearts() {
  if (heartsInterval) {
    clearInterval(heartsInterval);
    heartsInterval = null;
  }
  // remove any remaining heart DOM nodes
  Array.from(document.querySelectorAll('.heart')).forEach(h => h.remove());
}

// Sequence logic:
// 1) Tap -> show modal1 (I Miss You) and start hearts
tapBtn.addEventListener('click', () => {
  // hide start screen
  startScreen.style.display = 'none';
  // open first modal
  openModal(modal1);
  startHearts();
  // focus first action for accessibility
  setTimeout(()=> document.getElementById('modal1Next').focus(), 250);
});

// 2) modal1 Next -> close modal1 and open modal2
modal1Next.addEventListener('click', () => {
  closeModal(modal1);
  // small delay to let the first modal close animation feel natural
  setTimeout(() => {
    openModal(modal2);
    setTimeout(()=> document.getElementById('closeBtn').focus(), 200);
  }, 220);
});

// 3) close Btn -> close modal2, stop hearts, show start screen (so user can replay)
closeBtn.addEventListener('click', () => {
  closeModal(modal2);
  stopHearts();
  // show start screen again so they can tap again
  startScreen.style.display = '';
});

// allow ESC to close current modal (nice-to-have)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal2.classList.contains('open')) {
      closeBtn.click();
    } else if (modal1.classList.contains('open')) {
      // go back to start
      closeModal(modal1);
      stopHearts();
      startScreen.style.display = '';
    }
  }
});
