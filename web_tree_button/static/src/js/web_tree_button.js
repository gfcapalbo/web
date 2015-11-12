//  @@@ web_export_view custom JS @@@
//#############################################################################
//    
//    Copyright (C) 2012 Agile Business Group sagl (<http://www.agilebg.com>)
//    Copyright (C) 2012 Therp BV (<http://therp.nl>)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as published
//    by the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
//#############################################################################
openerp.web_tree_button = function (instance) {

    var _t = instance.web._t, QWeb = instance.web.qweb;

    instance.web.View.include({
       start: function () {
            var self = this;
            var p = this._super.apply(this, arguments);
            if (self.ViewManager &&
                self.$buttons  &&
                self.model && self.model == 'stock.picking' &&
                self.ViewManager.active_view == 'list')
            {   
               self.$buttons.append(QWeb.render('AddTreeButton', {widget: self}));
               self.$buttons.find('.oe_extrabutton').on('click', self.perform_button_action);
            }
            return $.when(p);
        },

        perform_button_action: {},

    });

}
