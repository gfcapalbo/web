odoo.define('widget_translation_enforcement.translate_dialog', function(require){
"use strict";

var core = require('web.core');
var common = require('web.form_common');
var data = require('web.data');

var Dialog = require('web.Dialog');
var FormView = require('web.FormView');
var View = require('web.View');

var _t = core._t;
var QWeb = core.qweb;



FormView.include({
    /*kill the translation alert by breaking inheritance
     * the current mods, that force user to visualize popup with all 
     * languages renders the warning useless. it was previously 
     * used to warn user that a language had changed, and the other languages
     * should be updated as well. 
     */
    display_translation_alert: function(values) {
    },
});


common.AbstractField.include({
    init: function(field_manager, node) {
	this._super(field_manager, node);
            this.$enforced_translate = (_t.database.multi_lang && this.field.translate) ? $('<button/>', {
            type: 'button',
        }).addClass('o_field_translate fa fa-globe btn btn-link o_field_enforced_notedit') : $();
    },
    _set_readonly: function() {
        if (this.field.translate == true && this.field_manager.get('actual_mode') !== "create") {
          this.$el.attr('readonly', 1);
        }
    },
    renderElement: function() {
	var self = this
	this._super();
        if (!this.disable_utility_classes) {
             this.on("change:readonly", this, this._set_readonly);
             this._set_readonly();
         } 
    },
    start: function () {
	this._super();
        if (this.view) {
	   this.$enforced_translate
                .insertAfter(this.$el)
                .on('click', _.bind(this.on_translate, this));
	}
    },
    _check_css_flags : function() {
	this._super();
        var show_enforced_translate = (this.get('effective_readonly') && this.field_manager.get('actual_mode') !== "create");
        this.$enforced_translate.toggleClass('o_translate_active', !!show_enforced_translate);

    },

});


});


