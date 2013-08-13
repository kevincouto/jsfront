"use strict";

(function() {
	var File = {
		/**
		 * Retorna o nome de um arquivo do path ou url, sem extens&atilde;o e
		 * sem parâmetros get
		 * 
		 * @param {string}  path
		 * @param {boolean=} ext Define se deve retirar(true) ou  n&atilde;o(false)[default] a extensão
		 * @returns {string}
		 */
		name : function(path, ext) {
			var i;
			i = path.lastIndexOf('?');
			if (i >= 0)
				path = path.substring(0, i); /* retira os parÃ¢metros ?a=xx */
			if (!ext) {
				i = path.lastIndexOf('.');
				if (i >= 0)
					path = path.substring(0, i); /* retira a extens&atilde;o; */
			}
			i = path.lastIndexOf('/');
			if (i >= 0)
				path = path.substring(i + 1); /* retira o path */

			return path;
		},

		/**
		 * Retorna o path ou url, sem o nome do arquivo e sem parÃ¢metros get
		 * 
		 * @param {string} path
		 * @returns {string}
		 */
		path : function(path) {
			var i = path.lastIndexOf('?');
			if (i >= 0)
				path = path.substring(0, i); // retira os parÃ¢metros ?a=xx

			i = path.lastIndexOf('/');
			if (i >= 0)
				path = path.substring(0, i); // retira o nome do arquivo

			return path;
		},

		/**
		 * Retorna a url completa. http://...
		 * 
		 * @param {string} path
		 * @returns {string}
		 */
		absoluteUrl : function(path) {
			var i, b = '', q = 0, url1 = '', url2 = '';
			var http = (window.location + '').split('//');
			var parts1 = path.split('/');
			var parts2 = http[1].split('/');

			for (i = 0; i < parts1.length; i++) {
				if (parts1[i] != '..') {
					url1 += b + parts1[i];
					b = '/';
				} else {
					q++;
				}
			}

			b = '';

			for (i = 0; i < parts2.length - q - 1; i++) {
				url2 += b + parts2[i];
				b = '/';
			}

			return (http[0] + '//' + url2 + '/' + url1);
		}
	};
    
    window['File'] = File;
}());
