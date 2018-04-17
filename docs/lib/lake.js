lake = function(img, options) {
	var settings = Object.assign({}, {
		'speed':       1,
		'scale':       1,
		'waves':       10,
		'image':       true,
		'hideImage':   true,
	}, options);

	var waves = settings['waves'];
	var speed = settings['speed']/4;
	var scale = settings['scale']/2;

	var ca = document.createElement('canvas');
	var c = ca.getContext('2d');

	var w, h, dw, dh;

	var offset = 0;
	var frame = 0;
	var max_frames = 0;
	var frames = [];

	var prerender_animation = function() {
		c.save();

		c.canvas.width  = img.width;
		c.canvas.height = img.height*2;

		c.drawImage(img, 0,  0);

		c.scale(1, -1);
		c.drawImage(img, 0,  -img.height*2);

		c.restore();

		w = c.canvas.width;
		h = c.canvas.height;
		dw = w;
		dh = h/2;

		var id = c.getImageData(0, h/2, w, h).data;
		var end = false;

		// precalc frames
		// image displacement
		c.save();
		while (!end) {
			var odd = c.createImageData(dw, dh);
			var od = odd.data;
			// var pixel = (w*4) * 5;
			var pixel = 0;
			for (var y = 0; y < dh; y++) {
				for (var x = 0; x < dw; x++) {
					// var displacement = (scale * dd[pixel]) | 0;
					var displacement = (scale * 10 * (Math.sin((dh/(y/waves)) + (-offset)))) | 0;
					var j = ((displacement + y) * w + x + displacement)*4;

					// horizon flickering fix
					if (j < 0) {
						pixel += 4;
						continue;
					}

					// edge wrapping fix
					var m = j % (w*4);
					var n = scale * 10 * (y/waves);
					if (m < n || m > (w*4)-n) {
						var sign = y < w/2 ? 1 : -1;
						od[pixel]   = od[pixel + 4 * sign];
						od[++pixel] = od[pixel + 4 * sign];
						od[++pixel] = od[pixel + 4 * sign];
						od[++pixel] = od[pixel + 4 * sign];
						// Tune these parameters to get VHS or glitch effects!
						// if(Math.sin(pixel)<0.3){
						++pixel;
						// }else{
						// 	pixel+=~~(Math.sin(pixel/5000)*20);
						// }
						continue;
					}

					// What was the idea here? transparent graphics seem to work better with if true...
					// There was probably some reasoning behind this, but maybe transparency support
					// just wasn't tested after some point, and changes were made, and it broke? I don't know!
					// Or maybe they just wanted a different effect for transparency, or something.
					// if (id[j+3] != 0) {
					if (true) {
						od[pixel]   = id[j];
						od[++pixel] = id[++j];
						od[++pixel] = id[++j];
						od[++pixel] = id[++j];
						++pixel;
					} else {
						od[pixel]   = od[pixel - w*4];
						od[++pixel] = od[pixel - w*4];
						od[++pixel] = od[pixel - w*4];
						od[++pixel] = od[pixel - w*4];
						++pixel;
						// pixel += 4;
					}
				}
			}

			if (offset > speed * (6/speed)) {
				offset = 0;
				max_frames = frame - 1;
				// frames.pop();
				frame = 0;
				end = true;
			} else {
				offset += speed;
				frame++;
			}
			frames.push(odd);
		}
		c.restore();
		if (!settings.image) {
			c.height = c.height/2;
		}
	};

	var animate = function() {
		if (!settings.image) {
			c.putImageData(frames[frame], 0, 0);
		} else {
			c.putImageData(frames[frame], 0, h/2);
		}
		// c.putImageData(frames[frame], 0, h/2);
		if (frame < max_frames) {
			frame++;
		} else {
			frame = 0;
		}
		requestAnimationFrame(animate);
	};

	var when_img_is_loaded = function(callback) {
		if (img.complete || img.readyState === 4) {
			// image was likely cached
			callback();
		} else {
			img.addEventListener("load", callback);
		}
	};

	when_img_is_loaded(function(){
		prerender_animation();
		
		img.parentNode.insertBefore(ca, img);
		if (settings.hideImage) {
			img.style.display = "none";
		}

		animate();
	});
}
