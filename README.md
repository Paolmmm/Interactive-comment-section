# Interactive-comment-section

This app generates random comments that you can interact with replying, leaving likes... all that social stuff.
It prints 50 comments and every 5 comments it slows the printing of new ones. You can change the max number of comments in the config file.

The most challenging feature to implement has been the updating date on each comment, which has taken me I guess 3 days until i figured out there was a very simple
solution and that's the one you can see in the controller's function commentGenerator.

The pop up menu is very basic but it's just a minor feature that needed to be implemented.

BUGS: 
- if you reply to a reply, the comment will start with a quote (@name) in bold, if you edit the comment the quote will
then turn into standard text (because it's not in the span anymore). You can also delete it, nothing will change in the "database".
- personal comments date is wrong but that's a problem with the whole time system, pretty sure it's not how this kind of stuff get handled
