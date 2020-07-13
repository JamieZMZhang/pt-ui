module.exports = function override(config) {
	config.optimization.runtimeChunk = false;
	config.output.filename = '[name].js';
	config.devtool = false;
	config.optimization.splitChunks = {
		cacheGroups: {
			default: false
		}
	};
	return config;
};