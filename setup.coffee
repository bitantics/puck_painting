###
 Puck Paint Setup
###

# Globals #

intervalId = undefined

# Functions #

init = (domParent = document.body) ->
    # make painter/eraser puck pair
    painterPuck = new Puck domParent, {x: 20, y: 20}
    eraserPuck  = new Puck domParent, {x: 20, y: 60}, {class: 'eraser'}
    pucks = [painterPuck, eraserPuck]

    # stop any currently running puck paint
    if intervalId then stop()

    # on click of a puck, make canvas and start the drawing function loop
    starter = ->
        puck.el.removeEventListener('mousedown', starter) for puck in pucks
        start pucks, domParent

    for puck in pucks
        puck.el.addEventListener 'mousedown', starter

start = (pucks, domParent) ->
    painterPuck = pucks[0]
    eraserPuck  = pucks[1]

    # make canvas
    canvas = new PuckCanvas domParent
    painterPuck.addMoveListener (pos) ->
        canvas.drawTo pos

    eraserPuck.addMoveListener (pos) ->
        ep = eraserPuck
        canvas.clearRect
            x: ep.pos.x
            y: ep.pos.y
            width:  ep.dims.x
            height: ep.dims.y


    # start new loop
    intervalId = setInterval step, 1000/60, pucks, canvas

stop = -> clearInterval intervalId

step = (pucks, canvas) ->
    puck.update().render() for puck in pucks

@PuckPaint =
    init: init
    stop: stop
