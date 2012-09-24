###
 Vector Class
###

class Vector
    constructor: (@x = 0, @y = 0) ->
        # init from object
        if @x?.x and @x?.y
            @y = @x.y
            @x = @x.x

        @self = new SelfVector @

    dupl: ->
        new Vector(@x, @y)

    load: (other) ->
        @x = other.x
        @y = other.y
        @

    magn: ->
        Math.sqrt Math.pow(@x, 2) + Math.pow(@y, 2)

    add: (other) ->
        sum = @dupl()
        sum.x += other.x
        sum.y += other.y
        sum

    sub: (other) ->
        diff = @dupl()
        diff.x -= other.x
        diff.y -= other.y
        diff

    scale: (scalar) ->
        scaled = @dupl()
        scaled.x *= scalar
        scaled.y *= scalar
        scaled

    rotate: (rad) ->
        x = @x * Math.cos(rad) - @y * Math.sin(rad)
        y = @x * Math.sin(rad) + @y * Math.cos(rad)

        new Vector(x, y)

    unit: ->
        @scale 1/@magn()


class SelfVector extends Vector
    constructor: (@self) ->

    add: (other) ->
        @self.load @self.add other

    sub: (other) ->
        @self.load @self.sub other

    scale: (scalar) ->
        @self.load @self.scale scalar

    rotate: (rad) ->
        @self.load @self.rotate rad
