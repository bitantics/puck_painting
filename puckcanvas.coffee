###
 Puck Canvas Class
###

class PuckCanvas
    constructor: (domParent) ->
        # make canvas element as big as page
        cvs = document.createElement 'canvas'
        cvs.setAttribute 'class', 'puckcanvas'

        bounds = DOMNorm.size domParent
        cvs.setAttribute 'width',  bounds.width
        cvs.setAttribute 'height', bounds.height
        domParent.appendChild cvs

        # initialize context, style, and start drawing path
        @ctx = cvs.getContext '2d'
        @ctx.strokeStyle = '#7a4e4e'
        @ctx.lineWidth = 2

    drawTo: (point) ->
        if not @lastPoint then @lastPoint = point

        @ctx.beginPath()
        @ctx.moveTo @lastPoint.x, @lastPoint.y
        @ctx.lineTo point.x, point.y
        @ctx.stroke()
        @ctx.closePath()

        @lastPoint = point

    clearRect: (rect) ->
        @ctx.clearRect rect.x, rect.y, rect.width, rect.height
