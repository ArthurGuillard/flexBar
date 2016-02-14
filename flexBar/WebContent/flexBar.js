/**
 * 	flexBar JQuery plugin by Arthur Guillard
 *  using : -bootstrap
 *  		-JQuery
 */
(function($) {
	var instances = [];

	function FlexBar($el, options) {
    	this._hiddenMethods = {
	        show 		: _show,
	        hide 		: _hide,
	        onShow		: _onShow,
	        onHide		: _onHide,
	        onChange	: _onChange
		};
    	
	    this._properties = {
	        initialized 	: false,
	        data			: null
	    };

	    this._defaults = {
			position	: 'top',
			onShow		: null,
			onHide		: null,
			onChange	: null
	    };

	    function _show(data) {
	    	$(this).trigger('flexbar-show', new Event(	$(this),
	    											  	'onShow',
	    											  	data));
	    	return $(this);
	    };

	    function _hide(data) {
	    	$(this).trigger('flexbar-hide', new Event(	$(this),
					  									'onHide',
					  									data));
	    	return $(this);
	    };

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

	    this._defaults = $.extend(
    			{},
    			this._defaults,
    			options
    	);

	    $el.on("flexbar-show", _onShow);
	    $el.on("flexbar-hide", _onHide);
	    $el.on("flexbar-change", _onChange);

    	this._properties.initialized = true;
	    return this;
	}

	$.fn.flexBar = function(methodOrOptions) {
    	$el = $(this);
    	var flexBar = $el.data('flexBar');

    	if (flexBar) {
    		if (typeof methodOrOptions === 'object' || !methodOrOptions) {
	    		// TODO think maybe return flexBar instance instead of error ?
    			$.error('$.flexBar is already initialized on \'' + (flexBar.prop('id') ? flexBar.prop('id') : 'Object') + "\'.");
    		} else {
            	if (flexBar._hiddenMethods[methodOrOptions] && !isEvent(methodOrOptions)) {
            		return flexBar._hiddenMethods[methodOrOptions].apply($el, Array.prototype.slice.call(arguments, 1));
                } else if (methodOrOptions in flexBar._defaults) {
                	if (typeof flexBar._defaults[methodOrOptions] === 'function') {
                		return flexBar._defaults[methodOrOptions].apply($el, Array.prototype.slice.call(arguments, 1));
                	}
                	else {
                		return flexBar._defaults[methodOrOptions];
                	}
                } else {
                	$.error('Unknown property \'' +  methodOrOptions + '\' in $.flexBar');
                }
    		}
    	} else {
    		var options = (typeof methodOrOptions === 'object') ? methodOrOptions : undefined;
    		var flexBarData = new FlexBar($el, options);

    		$el.data('flexBar', flexBarData);
    		return $el;
    	}
    };

    /**
     * Event utils
     */
    function Event(object, name, data) {
    	this.object = object;
    	this.name = name;
    	this.data = data;
    }

    /**
     * FlexBar Buttons
     */
    function FlexBarButton(label, callback, id, cssClass) {
    	this.label = label;
    	if (!label)
    		$.warn("No label provided for FlexBarButton" + (id ? (" '" + id + "'") : "..."));
    	this.callback = callback;
    	if (!callback)
    		$.warn("No callback function provided for FlexBarButton" + (id ? (" '" + id + "'") : "..."));
    	this.id = id;
    	if (!id && callback)
    		$.error("No id provided for FlexBarButton but a callback function was... Callback can't be set without an id!");
    	this.cssClass = cssClass;
    }

    FlexBarButton.prototype.getButtonAsHtml = function() {
    	var htmlButton = "<button type='button'";
    	if (this.id)
    		htmlButton += " id='" + this.id + "'";
    	if (this.cssClass)
    		htmlButton += " class='" + this.cssClass + "'";
    	htmlButton += ">";
    	if (this.label)
    		htmlButton += this.label;
    	htmlButton += "</button>";
    	return htmlButton;
    }
    
    /**
     * Utilities function
     */
    function isEvent(eventName) {
    	return 	eventName == 'flexbar-show' ||
    			eventName == 'flexbar-hide' ||
    			eventName == 'change';
    }
})(jQuery);