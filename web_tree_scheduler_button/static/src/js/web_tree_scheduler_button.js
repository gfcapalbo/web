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
openerp.web_tree_scheduler_button = function (instance) {

    var _t = instance.web._t, QWeb = instance.web.qweb;
    
    instance.web.View.include({
        start: function () 
        {
            var self = this;
            return this._super.apply(this, arguments)
            .then(function()
            {
                if (self.ViewManager &&
                        self.$buttons  &&
                        self.model && self.model == 'stock.picking' &&
                        self.ViewManager.active_view == 'list')
                {
                    self.$buttons.append(QWeb.render('AddTreeButton', {widget: self}));
                    self.getLastUpdate();
                    self.$buttons.find('.oe_extrabutton').on('click', self.proxy('perform_button_action'));
                }
            })
        },
        perform_button_action:  function() 
        {
            var self = this;
            var upd = new instance.web.Model("stock.picking");
            self.waiting();
            return upd.call('search_read',[],
                    {
                       domain: [['state' ,'=', 'waiting']],
                       fields: ['id'],
                    })
                    .then( function (pickings)
                        {
                        var pick_ids = [];
                        for (var i = 0; i < pickings.length; i++) {
                            pick_ids.push(pickings[i].id)
                            }
                        upd.call("action_assign" ,  [pick_ids], {})
                        .then(self.proxy('getLastUpdate'))
                        .then(self.ViewManager.do_searchview_search());
                        });
        },

        getLastUpdate: function()
        {
            var self = this,
                ir_config_parameter = new openerp.web.Model('ir.config_parameter');
            self.waiting();
            return ir_config_parameter.call(
                'get_param', ['web_tree_scheduler_button.last_scheduler_update'])
                .then(function (date)
                {
                    var datestr = _.str.sprintf(
                        _t('Last statuses Update: %s'),
                        date);
                    self.$buttons.find('#dateplace').html(datestr);
                });
        }, 
        waiting: function()
        {
            var self = this;
            self.$buttons.find('#dateplace').html('Updating ....');
        }, 
});

}
