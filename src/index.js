const Authorization = "Client-ID 4b9a7fbd7ac8b24"

const albumFromURL = (text) => {
	return text.trim().match(/\/(a|g|gallery)\/([\w\d]+)$|(?:^|\/)([\w\d]+)$/i)?.slice(1).filter(Boolean).slice(0, 2).reverse().map((string) => {
		return (string == "a") ? "album" : (string == "g") ? "gallery" : string
	})
}

const imageFromURL = (text) => {
	return text.trim().match(/com\/(\w+)$|([\w\d]{7})(?:\.\w+)?/i)?.slice(1).filter(Boolean)[0]
}

const loadAlbum = ([hash, type = "album"]) => {
	images.textContent = "Loading..."

	fetch(`https://api.imgur.com/3/${type}/${hash}`, { headers: { Authorization } })
		.then((res) => res.json())
		.then((json) => {
			images.textContent = ""

			json.data.images.forEach((img) => {
				images.appendChild(imageToElement(img))
			})
		})
		.catch((err) => {
			images.textContent = err
		})
}

const loadImage = (img) => {
	images.textContent = "Loading..."

	fetch(`https://api.imgur.com/3/image/${img}`, { headers: { Authorization } })
		.then((res) => res.json())
		.then((json) => {
			images.textContent = ""

			images.appendChild(imageToElement(json.data))
		})
		.catch((err) => {
			images.textContent = err
		})
}

const imageToElement = (img) => {
	if (img.mp4) {
		const video = images.appendChild(document.createElement("video"))
		video.controls = true
		video.src = img.mp4

		return video
	} else {
		const link = images.appendChild(document.createElement("a"))
		link.href = img.link
		link.target = "_blank"

		const image = link.appendChild(document.createElement("img"))
		image.src = img.link.replace(/\.[^.]*$/, "_d$&") + "?maxwidth=320&shape=thumb&fidelity=medium"

		return link
	}
}

const app = document.body.appendChild(document.createElement("div"))

const handleString = (string) => {
	if (albumFromURL(string)) {
		const album = albumFromURL(string)
		loadAlbum(album)
	}
	else {
		const image = imageFromURL(string)
		loadImage(image)
	}
}

const form = app.appendChild(document.createElement("form"))
const images = app.appendChild(document.createElement("div"))

if (location.hash) {
	handleString(location.hash)
}
else {
	form.onsubmit = (e) => {
		e.preventDefault()

		handleString(input.value)
	}

	const input = form.appendChild(document.createElement("input"))
	input.type = "text"
	input.placeholder = "Image or album..."

	const submit = form.appendChild(document.createElement("input"))
	submit.type = "submit"
	submit.value = "Go"
}
