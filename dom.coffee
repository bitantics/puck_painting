###
 Cross Browser DOM
###

class DOMNormalizer

    size: (node) ->
        dims =
            width:  node.scrollWidth
            height: node.scrollHeight

        if node is document.body
            dims =
                width:  Math.max dims.width,  window.innerWidth
                height: Math.max dims.height, window.innerHeight

        dims

DOMNorm = new DOMNormalizer()
