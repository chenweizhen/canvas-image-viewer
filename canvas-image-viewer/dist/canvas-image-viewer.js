//#region src/ImageViewer.ts
var e = class {
	constructor(e) {
		this.currentIndex = 0, this.imageList = [], this.imageState = {
			scale: 1,
			x: 0,
			y: 0,
			rotation: 0
		}, this.isDragging = !1, this.lastX = 0, this.lastY = 0, this.options = Object.assign({
			width: 1e3,
			height: 650,
			thumbnailHeight: 120
		}, e), this.container = e.container, this.initCanvas(), this.loadImages(), this.bindEvents();
	}
	initCanvas() {
		this.container.style.position = "relative", this.container.style.background = "#1e1e1e", this.container.style.userSelect = "none", this.mainCanvas = document.createElement("canvas"), this.mainCanvas.width = this.options.width, this.mainCanvas.height = this.options.height - this.options.thumbnailHeight, this.mainCanvas.style.cursor = "grab", this.mainCanvas.style.display = "block", this.mainCtx = this.mainCanvas.getContext("2d"), this.thumbCanvas = document.createElement("canvas"), this.thumbCanvas.width = this.options.width, this.thumbCanvas.height = this.options.thumbnailHeight, this.thumbCanvas.style.position = "absolute", this.thumbCanvas.style.bottom = "0", this.thumbCanvas.style.cursor = "pointer", this.thumbCanvas.style.display = "block", this.thumbCtx = this.thumbCanvas.getContext("2d"), this.container.appendChild(this.mainCanvas), this.container.appendChild(this.thumbCanvas);
	}
	loadImages() {
		let e = this.options.imageList.map((e) => new Promise((t, n) => {
			let r = new Image();
			r.crossOrigin = "anonymous", r.src = e, r.onload = () => t(r), r.onerror = () => n(/* @__PURE__ */ Error(`Failed to load image: ${e}`));
		}));
		Promise.all(e).then((e) => {
			this.imageList = e, this.renderAll();
		}).catch((e) => {
			console.error("Error loading images:", e);
		});
	}
	renderAll() {
		this.renderMainImage(), this.renderThumbnails();
	}
	renderMainImage() {
		let e = this.mainCtx, t = this.mainCanvas, n = this.imageList[this.currentIndex];
		if (!n) return;
		let r = this.imageState;
		e.clearRect(0, 0, t.width, t.height), e.save(), e.translate(t.width / 2, t.height / 2), e.rotate(r.rotation * Math.PI / 180);
		let i = n.width * r.scale, a = n.height * r.scale;
		e.drawImage(n, -i / 2 + r.x, -a / 2 + r.y, i, a), e.restore();
	}
	renderThumbnails() {
		let e = this.thumbCtx, t = this.thumbCanvas, n = t.height - 10;
		e.clearRect(0, 0, t.width, t.height), e.fillStyle = "#2a2a2a", e.fillRect(0, 0, t.width, t.height), this.imageList.forEach((t, r) => {
			let i = r * (n + 15) + 10, a = n * (t.width / t.height);
			r === this.currentIndex && (e.fillStyle = "#ffffff", e.fillRect(i - 3, 2, a + 6, n + 6)), e.fillStyle = "#3a3a3a", e.fillRect(i - 2, 3, a + 4, n + 4), e.drawImage(t, i, 5, a, n);
		});
	}
	bindEvents() {
		this.thumbCanvas.addEventListener("click", (e) => {
			let t = this.thumbCanvas.getBoundingClientRect(), n = e.clientX - t.left, r = this.thumbCanvas.height - 10, i = Math.floor((n - 10) / (r + 15));
			i >= 0 && i < this.imageList.length && (this.currentIndex = i, this.resetView(), this.renderAll());
		}), this.mainCanvas.addEventListener("mousedown", (e) => {
			this.isDragging = !0, this.lastX = e.clientX, this.lastY = e.clientY, this.mainCanvas.style.cursor = "grabbing";
		}), window.addEventListener("mousemove", (e) => {
			this.isDragging && (this.imageState.x += e.clientX - this.lastX, this.imageState.y += e.clientY - this.lastY, this.lastX = e.clientX, this.lastY = e.clientY, this.renderMainImage());
		}), window.addEventListener("mouseup", () => {
			this.isDragging = !1, this.mainCanvas.style.cursor = "grab";
		}), this.mainCanvas.addEventListener("wheel", (e) => {
			e.preventDefault();
			let t = e.deltaY > 0 ? .9 : 1.1, n = this.imageState.scale * t;
			n >= .1 && n <= 10 && (this.imageState.scale = n, this.renderMainImage());
		}, { passive: !1 }), this.mainCanvas.addEventListener("mouseleave", () => {
			this.isDragging = !1, this.mainCanvas.style.cursor = "grab";
		});
	}
	prev() {
		this.currentIndex = (this.currentIndex - 1 + this.imageList.length) % this.imageList.length, this.resetView(), this.renderAll();
	}
	next() {
		this.currentIndex = (this.currentIndex + 1) % this.imageList.length, this.resetView(), this.renderAll();
	}
	rotate() {
		this.imageState.rotation = (this.imageState.rotation + 90) % 360, this.renderMainImage();
	}
	resetView() {
		this.imageState = {
			scale: 1,
			x: 0,
			y: 0,
			rotation: 0
		}, this.renderMainImage();
	}
	getCurrentIndex() {
		return this.currentIndex;
	}
	setCurrentIndex(e) {
		e >= 0 && e < this.imageList.length && (this.currentIndex = e, this.resetView(), this.renderAll());
	}
	getImageCount() {
		return this.imageList.length;
	}
	destroy() {
		this.container.innerHTML = "", this.imageList = [], this.imageState = {
			scale: 1,
			x: 0,
			y: 0,
			rotation: 0
		};
	}
};
//#endregion
export { e as ImageViewer };
