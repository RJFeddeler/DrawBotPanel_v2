var ShapePrototype = function(shapeName) {
	switch (shapeName) {
		case 'Circle':
			return {
				draw: function(ctx, x, y, radius) {
					ctx.arc(x, y, radius, 0, 2 * Math.PI);
				}
			};
		case 'Square':
			return {
				draw: function(ctx, x, y, radius) {
					ctx.moveTo(x - radius, y - radius);
					ctx.lineTo(x + radius, y - radius);
					ctx.lineTo(x + radius, y + radius);
					ctx.lineTo(x - radius, y + radius);
					ctx.lineTo(x - radius, y - radius);
				}
			};
		case 'RoundedSquare':
			return {
				draw: function(ctx, x, y, radius) {
					let cornerRadius = 10;

					ctx.moveTo(x - radius + cornerRadius, y - radius);
					ctx.lineTo(x + radius - cornerRadius, y - radius);
					ctx.arcTo(x + radius, y - radius, x + radius, y - radius + cornerRadius, cornerRadius);
					ctx.lineTo(x + radius, y + radius - cornerRadius);
					ctx.arcTo(x + radius, y + radius, x + radius - cornerRadius, y + radius, cornerRadius);
					ctx.lineTo(x - radius + cornerRadius, y + radius);
					ctx.arcTo(x - radius, y + radius, x - radius, y + radius - cornerRadius, cornerRadius);
					ctx.lineTo(x - radius, y - radius + cornerRadius);
					ctx.arcTo(x - radius, y - radius, x - radius + cornerRadius, y - radius, cornerRadius);
				}
			};
		default:
			return {
				draw: function(ctx, x, y, radius) {}
			};
	}
}