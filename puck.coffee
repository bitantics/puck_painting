###
 Puck Class
###

class Puck
    # slowdown of velocity per second
    #   |vel| *= ( 1 - friction )
    friction: 0.005

    # if the puck is currently being dragged with mouse
    mousePos: new Vector()

    date: new Date()

    constructor: (domParent, pos = {x: 0, y: 0}, options = {}) ->
        # construct position and velocity vectors
        #   puck is stopped at start
        @pos = new Vector pos
        @vel = new Vector()

        # construct dom node
        @el = document.createElement 'div'
        @el.setAttribute 'class', 'puck'

        if options.class
            @el.classList.add options.class
        
        @render()
        domParent.appendChild @el

        @dims = new Vector
            x:  @el.scrollWidth
            y:  @el.scrollHeight

        # get boundaries of our sliding area
        #   adjust for puck's height / width
        bounds = DOMNorm.size domParent
        @bounds = new Vector
            x: bounds.width
            y: bounds.height
        @bounds.self.sub @dims


        # initialize event handlers for moving puck with mouse dragging
        @el.addEventListener  'mousedown', (ev) =>
            @grabbed = true

            # stop puck
            @vel.self.scale 0

            # show grabbing hand
            @el.classList.add 'grabbed'

        document.addEventListener 'mouseup', =>
            @grabbed = false

            # hide grabbing hand
            @el.classList.remove 'grabbed'

        document.addEventListener 'mousemove', (ev) =>
            @mousePos.load
                x: ev.pageX
                y: ev.pageY

        # while mouse dragging, don't select any text
        if document.onselectstart
            onss = document.onselectstart
            document.onselectstart = => onss() and not @grabbed
        else
            document.onselectstart = => not @grabbed

        # initialize misc stuff
        @moveListeners = []
        @grabbed = false
        @lastTime = new Date().getTime()

        @

    addMoveListener: (moveListener) ->
        @moveListeners.push moveListener

    render: ->
        @el.style["top"]  = @pos.y + 'px'
        @el.style["left"] = @pos.x + 'px'

        @

    timeDelta: ->
        time = new Date().getTime()
        deltaSecs = (time - @lastTime) / 1000
        @lastTime = time

        return deltaSecs

    update: ->
        if @grabbed
            # adjust for 'location' of dom node being in top left 
            newPos = @mousePos.sub @dims.scale 1/2

            # keep track of our dragging speed
            @vel.load newPos.sub(@pos).scale 1/@timeDelta()

            # update position
            @pos.load newPos
        else
            # move puck and apply friction
            @pos.self.add @vel.scale @timeDelta()
            @vel.self.scale 1 - @friction

        # do boundary checks and adjust position/velocity if needed
        if @pos.x <= 0
            @vel.x = -@vel.x
            @pos.x = 0
        else if @pos.x >= @bounds.x
            @vel.x = -@vel.x
            @pos.x = @bounds.x

        if @pos.y <= 0
            @vel.y = -@vel.y
            @pos.y = 0
        else if @pos.y >= @bounds.y
            @vel.y = -@vel.y
            @pos.y = @bounds.y

        # call move listeners
        centerPos = @pos.add @dims.scale 1/2
        ml(centerPos) for ml in @moveListeners

        @
