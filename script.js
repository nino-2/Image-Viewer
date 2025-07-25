// Doubly Linked List headNode/tailNode
class Node {
  constructor(element) {
    this.element = element;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.headNode = null;
    this.tailNode = null;
    this.length = 0;
  }

  isEmpty() {
    return this.length === 0;
  }

  getSize() {
    return this.length;
  }

  // Add to the end - O(1) thanks to tailNode
  append(element) {
    const node = new Node(element);
    if (!this.headNode) {
      this.headNode = node;
      this.tailNode = node;
    } else {
      node.prev = this.tailNode;
      this.tailNode.next = node;
      this.tailNode = node;
    }
    this.length++;
  }

  // Add to the front - O(1)
  prepend(element) {
    const node = new Node(element);
    if (!this.headNode) {
      this.headNode = node;
      this.tailNode = node;
    } else {
      node.next = this.headNode;
      this.headNode.prev = node;
      this.headNode = node;
    }
    this.length++;
  }

  // Insert at index - O(n)
  addAt(index, element) {
    if (index < 0 || index > this.length) return false;
    if (index === 0) {
      this.prepend(element);
      return true;
    }
    if (index === this.length) {
      this.append(element);
      return true;
    }

    const node = new Node(element);
    let current = this.headNode;
    let i = 0;
    while (i < index) {
      current = current.next;
      i++;
    }
    // current is the node at 'index'
    const prev = current.prev;
    prev.next = node;
    node.prev = prev;
    node.next = current;
    current.prev = node;

    this.length++;
    return true;
  }

  // Remove by index - O(n)
  removeAt(index) {
    if (index < 0 || index >= this.length) return null;

    let removed;
    if (index === 0) {
      removed = this.headNode;
      this.headNode = this.headNode.next;
      if (this.headNode) this.headNode.prev = null;
      else this.tailNode = null; // list became empty
    } else if (index === this.length - 1) {
      removed = this.tailNode;
      this.tailNode = this.tailNode.prev;
      if (this.tailNode) this.tailNode.next = null;
      else this.headNode = null; // list became empty
    } else {
      let current = this.headNode;
      let i = 0;
      while (i < index) {
        current = current.next;
        i++;
      }
      removed = current;
      const prev = current.prev;
      const next = current.next;
      prev.next = next;
      next.prev = prev;
    }

    this.length--;
    return removed?.element ?? null;
  }

  // Remove first node whose element matches value - O(n)
  removeValue(value) {
    if (!this.headNode) return null;

    if (this.headNode.element === value) {
      const removed = this.headNode;
      this.headNode = this.headNode.next;
      if (this.headNode) this.headNode.prev = null;
      else this.tailNode = null;
      this.length--;
      return removed.element;
    }

    let current = this.headNode.next;
    while (current) {
      if (current.element === value) {
        const prev = current.prev;
        const next = current.next;
        prev.next = next;
        if (next) next.prev = prev;
        else this.tailNode = prev; // removed tail
        this.length--;
        return current.element;
      }
      current = current.next;
    }
    return null;
  }

  // Return value at index - O(n)
  elementAt(index) {
    if (index < 0 || index >= this.length) return null;
    let current = this.headNode;
    let i = 0;
    while (i < index) {
      current = current.next;
      i++;
    }
    return current.element;
  }

  // Search index by value - O(n)
  indexOf(value) {
    let current = this.headNode;
    let i = 0;
    while (current) {
      if (current.element === value) return i;
      current = current.next;
      i++;
    }
    return -1;
  }

  print() {
    let str = "";
    let current = this.headNode;
    while (current) {
      str += current.element + " ⇄ ";
      current = current.next;
    }
    str += "null";
    console.log(str);
  }
}

// ---------- Small "Image Viewer" wrapper ----------
class ImageViewer {
  constructor(imagesArray = []) {
    this.images = new DoublyLinkedList();
    imagesArray.forEach((img) => this.images.append(img));
    this.current = this.images.headNode; // pointer to the current image node
  }

  getCurrent() {
    return this.current ? this.current.element : null;
  }

  next() {
    if (this.current && this.current.next) {
      this.current = this.current.next;
    }
    return this.getCurrent();
  }

  prev() {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
    }
    return this.getCurrent();
  }

  append(url) {
    this.images.append(url);
    // If list was empty, current becomes the new node
    if (!this.current) this.current = this.images.headNode;
  }

  removeCurrent() {
    if (!this.current) return null;

    // Get index of current
    const idx = this.images.indexOf(this.current.element);
    const removed = this.images.removeAt(idx);

    // Move current pointer to a sensible neighbor
    if (idx < this.images.length) {
      // There is a next node at this index now
      this.current = this.images.headNode;
      let i = 0;
      while (i < idx && this.current) {
        this.current = this.current.next;
        i++;
      }
    } else {
      // Removed last element, move to new tail
      this.current = this.images.tailNode;
    }

    return removed;
  }

  isEmpty() {
    return this.images.isEmpty();
  }

  size() {
    return this.images.getSize();
  }
}

// MYIMAGES TO THE UI
const IMAGES = [
  "https://picsum.photos/id/10/800/500",
  "https://picsum.photos/id/20/800/500",
  "https://picsum.photos/id/30/800/500",
];

const viewer = new ImageViewer(IMAGES);

const imgEl = document.getElementById("viewer");
const statusEl = document.getElementById("status");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const removeBtn = document.getElementById("removeBtn");
const addBtn = document.getElementById("addBtn");
const inputEl = document.getElementById("imgInput");
const modalEl = document.getElementById("exampleModal");

const app = document.getElementById("viewerApp");
const toggleBtn = document.getElementById("themeToggle");

// (Optional) restore last choice
const saved = localStorage.getItem("theme");
if (saved) {
  app.setAttribute("data-theme", saved);
  toggleBtn.textContent =
    saved === "dark" ? "Switch to Light" : "Switch to Dark";
}

toggleBtn.addEventListener("click", () => {
  const current = app.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  app.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  toggleBtn.textContent =
    next === "dark" ? "Switch to Light" : "Switch to Dark";
});

// removeBtn.addEventListener('click', () => {
//   viewer.removeCurrent();
//   render();

// });

function render() {
  const current = viewer.getCurrent();
  imgEl.src = current || "";
  imgEl.style.display = current ? "block" : "none";
  statusEl.textContent = `Size: ${viewer.size()} | Current: ${
    current ?? "None"
  }`;
  prevBtn.disabled = !(viewer.current && viewer.current.prev);
  nextBtn.disabled = !(viewer.current && viewer.current.next);
  removeBtn.disabled = viewer.isEmpty();
}

nextBtn.addEventListener("click", () => {
  viewer.next();
  render();
});

prevBtn.addEventListener("click", () => {
  viewer.prev();
  render();
});

removeBtn.addEventListener("click", () => {
  viewer.removeCurrent();
  render();

  // Close the modal
  const modal =
    bootstrap.Modal.getInstance(modalEl) ||
    bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.hide();
});

addBtn.addEventListener("click", () => {
  const url = inputEl.value.trim();
  if (!url) return;
  viewer.append(url);
  inputEl.value = "";
  render();
});

// First render
render();
console.log(typeof bootstrap);
