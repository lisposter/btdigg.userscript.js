// ==UserScript==
// @name         Bulk copy the selected magnet links in btdigg.org
// @homepageURL  https://github.com/lisposter/btdigg.userscript.js
// @version      0.1
// @description  fast select and copy magnet
// @author       Leigh Zhu
// @match        http://btdigg.org/search?*
// @grant        none
// ==/UserScript==

;(function(window, document) {

  Node.prototype.prependChild = function(el) {
    if (this.childNodes[0]) {
      this.insertBefore(el, this.childNodes[0]);
    } else {
      this.appendChild(el);
    }
  };

  document.querySelector('body').innerHTML = document.querySelector('body').innerHTML +
    '<div id="links-panel" style="position: fixed;top: 10%;right: 2%;box-shadow: 0 5px 10px #ddd;border: 1px solid #02a3c6;">' +
      '<textarea id="magnet-links" cols="100" rows="10" style="border: 1px solid #f8f8f8;background: rgba(230, 230, 230, .9)"></textarea>' +
    '</div>';


  var magentLinks = Array.prototype.slice.call(document.querySelectorAll('a[href^=magnet]'))
    .map(function(itm) {
      return itm.href;
    });
  var selectedLinks = [];

  function addCheckboxs() {
    var magnetlinks = document.getElementById('magnet-links');
    Array.prototype.slice.call(document.querySelectorAll('.torrent_name'))
      .forEach(function(el) {
        var hash = /info_hash=(.+)(&q=.+)/.exec(el.querySelector('a').href)[1];
        var magnet = magentLinks.filter(function(link) {
          return link.indexOf(hash) >= 0;
        })[0];

        var ipt = document.createElement('input');
        ipt.setAttribute('type', 'checkbox');
        ipt.style.fontSize = '100%';
        ipt.style.marginRight = '.5em';
        ipt.addEventListener('change', function(e) {
          if (e.target.checked === true) {
            selectedLinks.push(magnet);
          } else {
            selectedLinks.splice(selectedLinks.indexOf(magnet), 1);
          }
          magnetlinks.value = selectedLinks.join('\n');
        });

        el.prependChild(ipt);
      });
  }

  addCheckboxs();

})(window, document);
