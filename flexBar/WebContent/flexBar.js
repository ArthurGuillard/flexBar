/**
 * 	flexBar JQuery plugin by Arthur Guillard
 *  using jQuery
 *  TODO: 
 *  -create 'real' javascript objects from FlexBar
 *  		=> prototype.constructor
 *  		=> properties should not be modifiable
 *  		=> some methods should not be callable
 *  		   if not called within the plugin context
 *  		=> find a way to cache $el.data('flexBar')
 *  		   because its ugly to declare it within each
 *  		   functions...
 *  -rename property visible => hidden
 *  -remove default options for css positionning with my default classes
 *  	because its a bad idea. Instead give function to set/get css
 *  	classes for flexBar div and child div
 *  	Just make style position fixed for flexBar div
 *  
 *  NB: Gonna have to refactor the hell out of this, since i had
 *  	some misunderstanding about javascript objects...
 */
(function($) {
	function FlexBar($el, options) {
		/**
		 * Private
		 */
		var _positions = {
			top		: 'flexbar-bar-top',
			left	: 'flexbar-bar-left',
			right	: 'flexbar-bar-right',
			bottom	: '',
			center	: ''
		}

		this._getPositions = function() {
			return _positions;
		}

		var _contentAlignments = {
			center	: 'flexbar-contentalign-center',
			left	: 'flexbar-contentalign-left',
			right	: ''
		}

		this._getContentAlignments = function() {
			return _contentAlignments;
		}

	    FlexBar.prototype.applyCss = function() {
	    	var elChildDiv = $el.children().first();
			if (this._defaults['cssClass']) {
				elChildDiv.addClass(this._defaults['cssClass']);
			} else {
				if (_positions[this._defaults['position']])
					elChildDiv.addClass(_positions[this._defaults['position']]);

				if (_contentAlignments[this._defaults['alignContent']])
					elChildDiv.addClass(_contentAlignments[this._defaults['alignContent']]);

				if (this._defaults['backgroundColor'])
					elChildDiv.css('background-color', this._defaults['backgroundColor']);

				if (this._defaults['width'])
					elChildDiv.css('width', this._defaults['width']);

				if (this._defaults['height'])
					elChildDiv.css('height', this._defaults['height']);

				if (this._defaults['zIndex'])
					elChildDiv.css('z-index', this._defaults['zIndex']);
			}
	    }

	    FlexBar.prototype.removeCss = function() {
	    	var elChildDiv = $el.children().first();
			if (this._defaults['cssClass']) {
				elChildDiv.removeClass(this._defaults['cssClass']);
			} else {
				if (_positions[this._defaults['position']])
					elChildDiv.removeClass(_positions[this._defaults['position']]);

				if (_contentAlignments[this._defaults['alignContent']])
					elChildDiv.removeClass(_contentAlignments[this._defaults['alignContent']]);

				elChildDiv.removeAttr('style');
			}
	    }

	    FlexBar.prototype.isElementInViewport = function(el) {
	    	el = el[0];

    	    var r = el.getBoundingClientRect();
    	    var w = $(window);
    	    return (
    	        r.top >= 0 &&
    	        r.left >= 0 &&
    	        r.bottom <= (w.innerHeight() || w.height()) &&
    	        r.right <= (w.innerWidth() || w.width())
    	    );
	    }

		/**
		 * Public
		 */
		this._properties = {
	        initialized 		: false,
	        visible				: false,
	        inViewport			: false,
	        inViewportChanged	: false
	    };

    	this._methods = {
	        show 			: _show,
	        hide 			: _hide,
	        add				: _add,
	        remove			: _remove,
	        onShow			: _onShow,
	        onHide			: _onHide,
	        onChange		: _onChange
		};

	    this._defaults = {
	    	cssClass		: null,
			position		: null,
			alignContent	: null,
			backgroundColor	: null,
			width			: null,
			height			: null,
			zIndex			: null,
			onShow			: null,
			onHide			: null,
			onChange		: null,
			onInViewport	: null,
			onOutViewport	: null,
			onViewportChange: null
	    };

	    function _show(data) {
	    	var flexBar = $el.data('flexBar');

	    	if (!flexBar._properties['visible']) {
		    	var event = new Event($(this), 'show', data);

		    	$(this).trigger('flexbar-show', event);
		    	$(this).trigger('flexbar-change', event);

		    	$(window).on('DOMContentLoaded load resize scroll', _onWindowViewportChange);
		    	$(this).show();

		    	flexBar._properties['visible'] = true;
	    	}

	    	return $(this);
	    };

	    function _hide(data) {
	    	var flexBar = $el.data('flexBar');

	    	if (flexBar._properties['visible']) {
		    	var event = new Event($(this), 'hide', data);
	    		$(this).trigger('flexbar-hide', event);
		    	$(this).trigger('flexbar-change', event);

		    	$(window).unbind('DOMContentLoaded load resize scroll', _onWindowViewportChange);
		    	$(this).hide();
		    	
		    	flexBar._properties['visible'] = false;
	    	}

	    	return $(this);
	    };

	    // TODO: add FlexBarButton + other premade elements
	    function _add() {
	    	var event = new Event($(this), 'add', data);
	    	$(this).trigger('flexbar-change', event);
	    	return $(this);
	    }

	    // TODO: remove FlexBarButton + other premade elements
	    function _remove() {
	    	var event = new Event($(this), 'remove', data);
	    	$(this).trigger('flexbar-change', event);
	    	return $(this);
	    }

	    function _onShow(data) {
	    	var flexBar = $el.data('flexBar');
	    	if (typeof flexBar._defaults['onShow'] === 'function')
	    		flexBar._defaults['onShow'].apply(this, Array.prototype.slice.call(arguments, 1));
	    	return flexBar._defaults['onShow'];
	    };

	    function _onHide(data) {
	    	var flexBar = $el.data('flexBar');
	    	if (typeof flexBar._defaults['onHide'] === 'function')
	    		flexBar._defaults['onHide'].apply(this, Array.prototype.slice.call(arguments, 1));
	    	return flexBar._defaults['onHide'];
	    };

	    function _onChange(data) {
	    	var flexBar = $el.data('flexBar');
	    	if (typeof flexBar._defaults['onChange'] === 'function')
	    		flexBar._defaults['onChange'].apply(this, Array.prototype.slice.call(arguments, 1));
	    	return flexBar._defaults['onChange'];
	    };

	    function _onWindowViewportChange() {
	    	var flexBar = $el.data('flexBar');

	    	if (flexBar._properties['visible']) {
	    		if (flexBar.isElementInViewport($el)) {
	    			if (!flexBar._properties['inViewport']) {
	    				flexBar._properties['inViewport'] = true;
	    				flexBar._properties['inViewportChanged'] = true;
	    			}
	    		} else {
	    			if (flexBar._properties['inViewport']) {
	    				flexBar._properties['inViewport'] = false;
	    				flexBar._properties['inViewportChanged'] = true;
	    			}
	    		}

	    		if (flexBar._properties['inViewportChanged']) {
	    			if (flexBar._properties['inViewport']) {
	    				if (typeof flexBar._defaults['onInViewport'] === 'function') {
		    				var event = new Event($(this), 'in', null);
	    					flexBar._defaults['onInViewport'](event);
	    				}
	    				//$(this).trigger('flexbar-viewport-in', event);
	    				flexBar.removeCss();
	    			}
	    			else {
	    				if (typeof flexBar._defaults['onOutViewport'] === 'function') {
		    				var event = new Event($(this), 'out', null);
	    					flexBar._defaults['onOutViewport'](event);
	    				}
	    				//$(this).trigger('flexbar-viewport-out', event);
	    				flexBar.applyCss();
	    			}
	    			if (typeof flexBar._defaults['onViewportChange'] === 'function') {
	    				var event = new Event($(this), 'change', null);
    					flexBar._defaults['onViewportChange'](event);
    				}
    				//$(this).trigger('flexbar-viewport-change', event);

	    			flexBar._properties['inViewportChanged'] = false;
	    		}
	    	}
	    }

	    // TODO: check if function can be seen outside FlexBar context
	    function encloseContentWith(el, tag) {
	    	var content = el.children();

	    	content.detach();
	    	el.append(tag);
	    	el.children().first().append(content);
	    }

	    encloseContentWith($el, '<div></div>');

	    this._defaults = $.extend(
    			{},
    			this._defaults,
    			options
    	);

	    $el.on("flexbar-show", _onShow);
	    $el.on("flexbar-hide", _onHide);
	    $el.on("flexbar-change", _onChange);
	    
	    /**
	     * TODO: find out why events are not fired or functions not called
	     */
//	    if (typeof this._defaults['onInViewport'] === 'function')
//	    	$el.on("flexbar-viewport-in", this._defaults['onInViewport']);
//	    if (typeof this._defaults['onOutViewport'] === 'function')
//	    	$el.on("flexbar-viewport-out", this._defaults['onOutViewport']);
//	    if (typeof this._defaults['onViewportChange'] === 'function')
//	    	$el.on("flexbar-viewport-change", this._defaults['onViewportChange']);

	    if (!this.isElementInViewport($el))
	    	this.applyCss();
	    	
    	this._properties['initialized'] = true;
	    return this;
	}

	$.fn.flexBar = function(methodOrOptions) {
    	$el = $(this);
    	var flexBar = $el.data('flexBar');
    	if (flexBar) {
    		if (typeof methodOrOptions === 'object' || !methodOrOptions) {
	    		return $(this);
    		} else {

    			function isEvent(eventName) {
    		    	return 	eventName == 'flexbar-show' ||
    		    			eventName == 'flexbar-hide' ||
    		    			eventName == 'flexbar-change';
    		    }

            	if (flexBar._methods[methodOrOptions] && !isEvent(methodOrOptions))
            		return flexBar._methods[methodOrOptions].apply($el, Array.prototype.slice.call(arguments, 1));
                else if (methodOrOptions in flexBar._defaults) {
                	if (arguments.length == 2)
                		return flexBar._defaults[methodOrOptions] = arguments[1];
                	else
                		return flexBar._defaults[methodOrOptions];
                } else if (methodOrOptions in flexBar._properties) {
                	if (arguments.length == 1)
                    	return flexBar._properties[methodOrOptions];
                } else {
                	$.error('Unknown property \'' +  methodOrOptions + '\' in $.flexBar');
                	return undefined;
                }
    		}
    	} else {
    		// TODO: find a cleaner way to check that...
    		// TODO: check if flexBar instance is actually deleted
    		//       when html el is removed from DOM??
    		// 	     nb: according to jQuery.data doc it should
    		if ($('#' + $(this).prop('id')).length > 0) {
    			var options = (typeof methodOrOptions === 'object') ? methodOrOptions : undefined;
        		var flexBarData = new FlexBar($el, options);

    			function checkParameters(options) {
        			if (options['alignContent'])
        				if (!(options['alignContent'] in flexBarData._getContentAlignments())) {
        					$.error('\'' + options['alignContent'] + '\' is not a valid default option for $.flexBar');
        					options['alignContent'] = null;
        				}
        			if (options['position'])
        				if (!(options['position'] in flexBarData._getPositions())) {
        					$.error('\'' + options['position'] + '\' is not a valid default option for $.flexBar');
        					options['position'] = null;
        				}
        		}

    			if (options)
    				checkParameters(options);

        		$el.data('flexBar', flexBarData);
        		return $el;
    		} else {
	    		$.error('Trying to use $.flexBar but no element were found in the document');
	    		return undefined;
	    	}
    	}
    };

    /**
     * Event
     */
    function Event(object, name, data) {
    	this.object = object;
    	this.name = name;
    	this.data = data;
    }
})(jQuery);