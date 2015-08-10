// ==UserScript==
// @name         btdigg.org bulk copy
// @namespace    http://zhu.li/
// @version      0.1
// @description  fast select and copy magnet
// @author       Leigh Zhu
// @match        http://btdigg.org/search?*
// @grant        none
// ==/UserScript==

;(function(window, document) {
    var magentLinks = Array.prototype.slice.call(document.querySelectorAll('a[href^=magnet]'))
        .map(function(itm) {
            return itm.href;
        });
    var selectedLinks = [];

    function parseLinks(links) {
        return links.map(function(itm) {
            var params = {};
            itm.split('?')[1].split('&').forEach(function(kv) {
                var tmp = {};
                params[kv.split('=')[0]] = kv.split('=')[1];
            });

            return {
                dn: decodeURIComponent(params.dn || ''),
                magnet: itm
            }
        })
    }

    function createList() {
        var tpl1 =  '<table>';
        var tpl2 =  '</table>' +
                    '<textarea rows="6" cols="100"></textarea>';

        var box = document.createElement('div');
        box.setAttribute('id', 'linksBox');

        var tableStr = parseLinks(magentLinks).reduce(function(memo, curr) {
            return memo + '<tr><td><input type="checkbox" data-magnet="' + curr.magnet + '"></td><td>' + curr.dn + '</td></tr>';
        }, tpl1);
        box.innerHTML = tableStr + tpl2;
        document.querySelector('body').appendChild(box);

        Array.prototype.slice.call(box.querySelectorAll('input')).forEach(function(ipt) {
            ipt.addEventListener('change', function(e) {
                if (e.target.checked === true) {
                    selectedLinks.push(e.target.dataset.magnet);
                } else {
                    selectedLinks.splice(selectedLinks.indexOf(e.target.dataset.magnet), 1);
                }

                box.querySelector('textarea').value = selectedLinks.join('\n');
            }, false);
        });
    }

    createList();


})(window, document);
