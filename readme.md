# Custom node core code

This repository provides python and javascript utilities that I use in a lot of my [custom nodes](https://github.com/chrisgoringe/cg-nodes-index). You may find some of it useful.

## base.py

Contains:

- `BaseNode` - a convenient base class for custom nodes.
- `class_property` - a decorator for defining a (read-only) class property
- `SeedContext` - a context manager that allows a section of code including random numbers (optionally with a seed) to be inserted into a python program without changing the sequence of random numbers generated for the rest of the code - so adding a new bit of code which uses random numbers doesn't break reproducability. Note that this applies to python randoms, not torch randoms. Usage is:

```python
random.seed(123)
x = random.random()           # x = 0.05236....
with SeedContext(456):
    if (doit):
        y = random.random()   # y = 0.74820....
z = random.random()           # z = 0.08718.... whether doit is True or False, or if the code was removed
```

Without SeedContext, the value of z would depend on whether doit was True or False.

## ui_decorator.py, ui_output_dispatch.js and ui_output.js

An easily expandable framework for custom nodes to send messages to the front end. The basic usage is as follows:

- use the ui_signal decorator on a custom node class to declare that it sends one or more messages:
```python
@ui_signal(['display_text'])
class my_custom_node():
```

- add the message(s) to be sent to the end of the tuple returned by the custom node
```python
def my_func(self, in1, in2):
    // do stuff
    return (output1, output2, message1)
```
where output1 and output2 are as declared in your RETURN_TYPES, and message1 is the message that will be sent to the node (with the key `display_text`)

To use an existing message, that's all you need to do. The code above will allow the custom node to return a text string, which will be displayed by the custom node on the front end. Try it!

The message tyeps defined are (see code in `ui_output.js`):
- `display_text` - as above
- `terminate` - if you send `terminate`, the UI will attempt to cancel the run (and turn off auto-queue). If you send `autoqueueoff` it will just turn off auto-queue. 
- `set_title_color` - will set the node to the (css-format) color specified.
- `modify_self` - send a tuple of two strings (widget_name, value), and the node will set it's widget with that name to that value. Note this doesn't change the value for the current run.
- `modify_other` - send a tuple of three strings (node_id, widget_name, value), and the node will try to set the value of a widget on another node to that value. Note this doesn't change the value for the current run.

## Adding new messages

If you look at `ui_output.js` you'll see that to add a new message you just have to define a JavaScript function, and add it to the list of message-function mapping in the list of calls to `registerUiOutputListener`. 

# But...

This whole mechanism depends on two lines of code being changed in the main code. There's a PR to make it happen [#1512](https://github.com/comfyanonymous/ComfyUI/pull/1512); another PR would incorporate all of this code into the codebase [#1483](https://github.com/comfyanonymous/ComfyUI/pull/1483), which may not fit with comfyanonymous' plans!