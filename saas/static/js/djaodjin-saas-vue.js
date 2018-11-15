function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    cache: false,
    crossDomain: false, // obviates need for sameOrigin test
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", djaodjinSettings.csrf);
        }
    }
});

Vue.mixin({
    delimiters: ['[[',']]'],
});

Vue.use(uiv, {prefix: 'uiv'});

Vue.filter('formatDate', function(value, format) {
  if (value) {
    if(!format){
        format = 'MM/DD/YYYY hh:mm'
    }
    if(!(value instanceof Date)){
        value = String(value);
    }
    return moment(value).format(format)
  }
});

Vue.filter("monthHeading", function(d) {
    // shift each period by 1 month unless this is
    // current month and not a first day of the month
    if( typeof d === 'string' ) {
        d = moment(d);
    }
    if(d.date() !== 1 || d.hour() !== 0
       || d.minute() !== 0 || d.second() !== 0 ) {
        return d.format("MMM'YY*");
    }
    return d.clone().subtract(1, 'months').format("MMM'YY");
});

Vue.filter('currencyToSymbol', function(currency) {
    if( currency === "usd" || currency === "cad" ) { return "$"; }
    else if( currency === "eur" ) { return "\u20ac"; }
    return currency;
});

Vue.filter('humanizeCell', function(cell, unit, scale) {
    var currencyFilter = Vue.filter('currency');
    var currencyToSymbolFilter = Vue.filter('currencyToSymbol');
    scale = scale || 1;
    var value = cell * scale;
    var symbol = '';
    if(unit) {
        symbol = currencyToSymbolFilter(unit);
    }
    return currencyFilter(value, symbol, 2);
});

Vue.filter('relativeDate', function(at_time) {
    var cutOff = new Date();
    if(this.ends_at ) {
        cutOff = new Date(this.ends_at);
    }
    var dateTime = new Date(at_time);
    if( dateTime <= cutOff ) {
        return moment.duration(cutOff - dateTime).humanize() + " ago";
    } else {
        return moment.duration(dateTime - cutOff).humanize() + " left";
    }
});

var countries = {
    "AF": "Afghanistan",
    "AX": "Åland Islands",
    "AL": "Albania",
    "DZ": "Algeria",
    "AS": "American Samoa",
    "AD": "Andorra",
    "AO": "Angola",
    "AI": "Anguilla",
    "AQ": "Antarctica",
    "AG": "Antigua and Barbuda",
    "AR": "Argentina",
    "AM": "Armenia",
    "AW": "Aruba",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BS": "Bahamas",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BT": "Bhutan",
    "BO": "Bolivia (Plurinational State of)",
    "BQ": "Bonaire, Sint Eustatius and Saba",
    "BA": "Bosnia and Herzegovina",
    "BW": "Botswana",
    "BV": "Bouvet Island",
    "BR": "Brazil",
    "IO": "British Indian Ocean Territory",
    "BN": "Brunei Darussalam",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "CV": "Cabo Verde",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "CA": "Canada",
    "KY": "Cayman Islands",
    "CF": "Central African Republic",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CX": "Christmas Island",
    "CC": "Cocos (Keeling) Islands",
    "CO": "Colombia",
    "KM": "Comoros",
    "CD": "Congo (the Democratic Republic of the)",
    "CG": "Congo",
    "CK": "Cook Islands",
    "CR": "Costa Rica",
    "CI": "Côte d'Ivoire",
    "HR": "Croatia",
    "CU": "Cuba",
    "CW": "Curaçao",
    "CY": "Cyprus",
    "CZ": "Czechia",
    "DK": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "SZ": "Eswatini",
    "ET": "Ethiopia",
    "FK": "Falkland Islands  [Malvinas]",
    "FO": "Faroe Islands",
    "FJ": "Fiji",
    "FI": "Finland",
    "FR": "France",
    "GF": "French Guiana",
    "PF": "French Polynesia",
    "TF": "French Southern Territories",
    "GA": "Gabon",
    "GM": "Gambia",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GR": "Greece",
    "GL": "Greenland",
    "GD": "Grenada",
    "GP": "Guadeloupe",
    "GU": "Guam",
    "GT": "Guatemala",
    "GG": "Guernsey",
    "GN": "Guinea",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HM": "Heard Island and McDonald Islands",
    "VA": "Holy See",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran (Islamic Republic of)",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IM": "Isle of Man",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JP": "Japan",
    "JE": "Jersey",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KI": "Kiribati",
    "KP": "Korea (the Democratic People's Republic of)",
    "KR": "Korea (the Republic of)",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Lao People's Democratic Republic",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libya",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MO": "Macao",
    "MK": "Macedonia (the former Yugoslav Republic of)",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "YT": "Mayotte",
    "MX": "Mexico",
    "FM": "Micronesia (Federated States of)",
    "MD": "Moldova (the Republic of)",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands",
    "NC": "New Caledonia",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger",
    "NG": "Nigeria",
    "NU": "Niue",
    "NF": "Norfolk Island",
    "MP": "Northern Mariana Islands",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestine, State of",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines",
    "PN": "Pitcairn",
    "PL": "Poland",
    "PT": "Portugal",
    "PR": "Puerto Rico",
    "QA": "Qatar",
    "RE": "Réunion",
    "RO": "Romania",
    "RU": "Russian Federation",
    "RW": "Rwanda",
    "BL": "Saint Barthélemy",
    "SH": "Saint Helena, Ascension and Tristan da Cunha",
    "KN": "Saint Kitts and Nevis",
    "LC": "Saint Lucia",
    "MF": "Saint Martin (French part)",
    "PM": "Saint Pierre and Miquelon",
    "VC": "Saint Vincent and the Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome and Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SX": "Sint Maarten (Dutch part)",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "GS": "South Georgia and the South Sandwich Islands",
    "SS": "South Sudan",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan",
    "SR": "Suriname",
    "SJ": "Svalbard and Jan Mayen",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syrian Arab Republic",
    "TW": "Taiwan (Province of China)",
    "TJ": "Tajikistan",
    "TZ": "Tanzania, United Republic of",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TK": "Tokelau",
    "TO": "Tonga",
    "TT": "Trinidad and Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TC": "Turks and Caicos Islands",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates",
    "GB": "United Kingdom of Great Britain and Northern Ireland",
    "UM": "United States Minor Outlying Islands",
    "US": "United States of America",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VE": "Venezuela (Bolivarian Republic of)",
    "VN": "Viet Nam",
    "VG": "Virgin Islands (British)",
    "VI": "Virgin Islands (U.S.)",
    "WF": "Wallis and Futuna",
    "EH": "Western Sahara",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe",
}

var regions = {
    "CA": {
        "AB": "Alberta",
        "BC": "British Columbia",
        "MB": "Manitoba",
        "NB": "New Brunswick",
        "NL": "Newfoundland and Labrador",
        "NT": "Northwest Territories",
        "NS": "Nova Scotia",
        "NU": "Nunavut",
        "ON": "Ontario",
        "PE": "Prince Edward Island",
        "QC": "Quebec",
        "SK": "Saskatchewan",
        "YT": "Yukon"
    },
    "US": {
        "AL": "Alabama",
        "AK": "Alaska",
        "AS": "American Samoa",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "AA": "Armed Forces Americas",
        "AE": "Armed Forces Europe",
        "AP": "Armed Forces Pacific",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District of Columbia",
        "FM": "Federated States of Micronesia",
        "FL": "Florida",
        "GA": "Georgia",
        "GU": "Guam",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MH": "Marshall Islands",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "MP": "Northern Mariana Islands",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PW": "Palau",
        "PA": "Pennsylvania",
        "PR": "Puerto Rico",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VI": "Virgin Islands",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    }
}



var itemListMixin = {
    data: function(){
        return this.getInitData();
    },
    methods: {
        getInitData: function(){
            data = {
                url: '',
                itemsLoaded: false,
                items: {
                    results: [],
                    count: 0
                },
                params: {},
                getCb: null,
            }
            if(djaodjinSettings.date_range.start_at ) {
                data.params['start_at'] = moment(djaodjinSettings.date_range.start_at).toDate()
            }
            if(djaodjinSettings.date_range.ends_at ) {
                data.params['ends_at'] = moment(djaodjinSettings.date_range.ends_at).toDate()
            }
            return data;
        },
        resetDefaults: function(overrides){
            if(!overrides) overrides = {}
            var data = Object.assign(this.getInitData(), overrides);
            Object.assign(this.$data, data);
        },
        get: function(){
            var vm = this;
            if(!vm.url) return
            if(vm[vm.getCb]){
                var cb = vm[vm.getCb];
            } else {
                var cb = function(res){
                    vm.items = res
                    vm.itemsLoaded = true;
                }
            }
            $.get(vm.url, vm.getParams(), cb);
        },
        getParams: function(){
            return this.params
        }
    },
}

var paginationMixin = {
    data: function(){
        return {
            params: {
                page: 1,
            },
            itemsPerPage: djaodjinSettings.itemsPerPage,
        }
    },
    computed: {
        totalItems: function(){
            return this.items.count
        },
        pageCount: function(){
            return Math.ceil(this.totalItems / this.itemsPerPage)
        }
    }
}

var filterableMixin = {
    data: function(){
        return {
            params: {
                q: '',
            },
            mixinFilterCb: 'get',
        }
    },
    methods: {
        filterList: function(){
            if(this.params.q) {
                if ("page" in this.params){
                    this.params.page = 1;
                }
            } 
            if(this[this.mixinFilterCb]){
                this[this.mixinFilterCb]();
            }
        },
    },
}

var sortableMixin = {
    data: function(){
        return {
            params: {
                o: djaodjinSettings.sortByField || 'created_at',
                ot: djaodjinSettings.sortDirection || 'desc',
            },
            mixinSortCb: 'get'
        }
    },
    methods: {
        sortBy: function(fieldName) {
            if(this.params.o === fieldName) {
                if(this.params.ot === "asc") {
                    this.params.ot = "desc";
                } else {
                    this.params.ot = "asc";
                }
            }
            else {
                this.params.o = fieldName
                this.params.ot = "asc";
            }
            if(this[this.mixinSortCb]){
                this[this.mixinSortCb]();
            }
        },
        sortIcon: function(fieldName){
            var res = 'fa fa-sort';
            if(fieldName === this.params.o){
                res += ('-' + this.params.ot);
            }
            return res;
        }
    },
}

var timezoneMixin = {
    data: function(){
        return {
            timezone: 'local',
        }
    },
    methods: {
        convertDatetime: function(data, isUTC){
            // Convert datetime string to moment object in-place because we want
            // to keep extra keys and structure in the JSON returned by the API.
            return data.map(function(f){
                var values = f.values.map(function(v){
                    // localizing the period to local browser time
                    // unless showing reports in UTC.
                    v[0] = isUTC ? moment.parseZone(v[0]) : moment(v[0]);
                });
            });
        },
    },
}

var userRelationMixin = {
    mixins: [itemListMixin, paginationMixin],
    data: function(){
        return {
            url: djaodjinSettings.urls.saas_api_user_roles_url,
            typeaheadUrl: djaodjinSettings.urls.api_users,
            modalOpen: false,
            unregistered: {
                slug: '',
                email: '',
                full_name: ''
            },
        }
    },
    methods: {
        remove: function(idx){
            var vm = this;
            var ob = this.items.results[idx]
            var slug = (ob.user ? ob.user.slug : ob.slug);
            if( djaodjinSettings.user && djaodjinSettings.user.slug === slug ) {
                if( !confirm("You are about to delete yourself from this" +
                             " role. it's possible that you no longer can manage" +
                             " this organization after performing this " +
                             " action.\n\nDo you want to remove yourself " +
                             " from this organization?") ) {
                    return;
                }
            }
            var url = vm.url + '/' + encodeURIComponent(slug);
            $.ajax({
                method: 'DELETE',
                url: url,
            }).done(function() {
                // splicing instead of refetching because
                // subsequent fetch might fail due to 403
                vm.items.results.splice(idx, 1);
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        saveUserRelation: function(slug){
            var vm = this;
            $.ajax({
                method: 'POST',
                url: vm.url,
                data: {slug: slug},
            }).done(function (resp) {
                vm.get()
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        handleNewUser: function(str){
            if(str.length > 0){
                this.unregistered = {
                    slug: str,
                    email: str,
                    full_name: str
                }
                this.modalOpen = true;
            }
        },
        save: function(item){
            if(item.slug !== undefined){
                this.saveUserRelation(item.slug)
            }
            else {
                this.handleNewUser(item)
            }
        },
        create: function(){
            var vm = this;
            var data = Object.assign({
                message: vm.$refs.modalText.value
            }, vm.unregistered)

            $.ajax({
                method: 'POST',
                url: vm.url + "?force=1",
                data: data,
            }).done(function (resp) {
                vm.modalOpen = false;
                vm.get()
            }).fail(function(resp){
                vm.modalOpen = false;
                showErrorMessages(resp);
            });
        }
    },
}

var subscriptionsMixin = {
    data: function(){
        return {
            ends_at: moment().endOf("day").toDate(),
        }
    },
    methods: {
        subscriptionURL: function(organization, plan) {
            return djaodjinSettings.urls.api_organizations
                + organization + "/subscriptions/" + plan;
        },
        endsSoon: function(subscription) {
            var cutOff = new Date(this.ends_at);
            cutOff.setDate(this.ends_at.getDate() + 5);
            var subEndsAt = new Date(subscription.ends_at);
            if( subEndsAt < cutOff ) {
                return "ends-soon";
            }
            return "";
        },
        
    },
}

var subscribersMixin = {
    methods: {
        editDescription: function(item, id){
            var vm = this;
            vm.$set(item, 'edit_description', true);
            // at this point the input is rendered and visible
            vm.$nextTick(function(){
                var ref = vm.refId(item, id);
                vm.$refs[ref][0].focus();
            });
        },
        saveDescription: function(item){
            // this solves a problem where user hits an enter
            // which saves the description and then once they
            // click somewhere this callback is triggered again
            // due to the fact that the input is blurred even
            // though it is hidden by that time
            if(!item.edit_description) return;
            this.$set(item, 'edit_description', false);
            delete item.edit_description;
            this.update(item)
        },
        refId: function(item, id){
            var ids = [item.organization.slug,
                item.plan.slug, id];
            return ids.join('_').replace(new RegExp('[-:]', 'g'), '');
        },
        update: function(item){
            var vm = this;
            var url = vm.subscriptionURL(
                item.organization.slug, item.plan.slug);
            $.ajax({
                method: 'PATCH',
                url: url,
                data: {description: item.description},
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
    }
}

Vue.component('user-typeahead', {
    template: "",
    props: ['url', 'role'],
    data: function(){
        return {
            target: null,
            searching: false,
            // used in a http request
            typeaheadQuery: '',
            // used to hold the selected item
            itemSelected: '',
        }
    },
    computed: {
        params: function(){
            res = {}
            if(this.typeaheadQuery) res.q = this.typeaheadQuery;
            return res
        },
    },
    methods: {
        // called by typeahead when a user enters input
        getUsers: function(query, done) {
            var vm = this;
            if(!vm.url) {
                done([]);
            }
            else {
                vm.searching = true;
                vm.typeaheadQuery = query;
                $.get(vm.url, vm.params, function(res){
                    vm.searching = false;
                    done(res.results)
                });
            }
        },
        submit: function(){
            this.$emit('item-save', this.itemSelected);
            this.itemSelected = '';
        }
    },
    mounted: function() {
        // TODO we should probably use one interface everywhere
        if(this.$refs.tphd)
            this.target = this.$refs.tphd[0];
    }
});

// TODO it probably makes sense to use this component in other
// places where user relations are needed
Vue.component('user-relation', {
    template: "",
    props: {
        roleUrl: '',
        role: {
            type: Object,
            default: function(){
                return {
                    slug: '',
                    title: ''
                }
            }
        },
    },
    mixins: [userRelationMixin],
    data: function(){
        return {
            url: this.roleUrl,
        }
    },
    watch: {
        // this should have been a computed propery, however
        // vue doesn't allow to have computed properties with
        // the same name as in data
        roleUrl: function (newVal, oldVal) {
            if(newVal != oldVal){
                this.url = newVal;
                this.params.page = 1;
                this.get();
            }
        }
    },
    mounted: function(){
        this.get();
    },
});

if($('#coupon-list-container').length > 0){
var app = new Vue({
    el: "#coupon-list-container",
    mixins: [
        itemListMixin,
        paginationMixin,
        filterableMixin,
        sortableMixin
    ],
    data: {
        url: djaodjinSettings.urls.saas_api_coupon_url,
        newCoupon: {
            code: '',
            percent: ''
        },
        edit_description: [],
        date: null
    },
    methods: {
        remove: function(idx){
            var vm = this;
            var code = this.items.results[idx].code;
            $.ajax({
                method: 'DELETE',
                url: vm.url + '/' + code,
            }).done(function() {
                vm.get()
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        update: function(coupon){
            var vm = this;
            $.ajax({
                method: 'PUT',
                url: vm.url + '/' + coupon.code,
                data: coupon,
            }).done(function (resp) {
                vm.get()
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        save: function(){
            var vm = this;
            $.ajax({
                method: 'POST',
                url: vm.url,
                data: vm.newCoupon,
            }).done(function (resp) {
                vm.get()
                vm.newCoupon = {
                    code: '',
                    percent: ''
                }
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        editDescription: function(idx){
            var vm = this;
            vm.edit_description = Array.apply(
                null, new Array(vm.items.results.length)).map(function() {
                return false;
            });
            vm.$set(vm.edit_description, idx, true)
            // at this point the input is rendered and visible
            vm.$nextTick(function(){
                vm.$refs.edit_description_input[idx].focus();
            });
        },
        saveDescription: function(coupon, idx, event){
            if (event.which === 13 || event.type === "blur" ){
                this.$set(this.edit_description, idx, false)
                this.update(this.items.results[idx])
            }
        },
        selected: function(idx){
            var coupon = this.items.results[idx]
            coupon.ends_at = (new Date(coupon.ends_at)).toISOString()
            this.update(coupon)
        },
    },
    mounted: function(){
        this.get()
    }
})
}

if($('#search-list-container').length > 0){
var app = new Vue({
    el: "#search-list-container",
    mixins: [itemListMixin, paginationMixin, filterableMixin],
    data: {
        url: djaodjinSettings.urls.api_accounts,
        mixinFilterCb: 'getUsersAndOrgs',
        usersLoaded: false,
        // a hack, but easier then doing pagination for both
        itemsPerPage: 50,
        users: {
            results: [],
            count: 0,
        },
    },
    methods: {
        getUsersAndOrgs: function(){
            this.get();
            this.getUsers();
        },
        getUsers: function(){
            var vm = this;
            $.get(djaodjinSettings.urls.api_users, vm.getParams(), function(res){
                vm.users = res
                vm.usersLoaded = true;
            });
        }
    },
    computed: {
        combined: function(){
            var first = this.items,
                second = this.users;
            var results = first.results.concat(second.results);
            var count = first.count + second.count;
            return {
                results: results ? results : [],
                count: count ? count : 0,
            }
        }
    },
})
}

if($('#today-sales-container').length > 0){
var app = new Vue({
    el: "#today-sales-container",
    mixins: [itemListMixin, paginationMixin],
    data: {
        url: djaodjinSettings.urls.api_receivables
    },
    mounted: function(){
        this.get()
    }
})
}

if($('#user-list-container').length > 0){
var app = new Vue({
    el: "#user-list-container",
    mixins: [itemListMixin, paginationMixin],
    data: {
        url: djaodjinSettings.urls.api_accounts
    },
    mounted: function(){
        this.get()
    }
})
}

if($('#user-relation-list-container').length > 0){
var app = new Vue({
    el: "#user-relation-list-container",
    mixins: [userRelationMixin],
    mounted: function(){
        this.get()
    }
})
}

if($('#metrics-container').length > 0){
var app = new Vue({
    el: "#metrics-container",
    mixins: [timezoneMixin],
    data: function(){
        var data = {
            tables: djaodjinSettings.tables,
            currentTab: 0,
            tableData: {},
        }
        var ends_at = moment(djaodjinSettings.date_range.ends_at);
        if(ends_at.isValid()){
            data.ends_at = ends_at.toDate();
        }
        else {
            data.ends_at = moment().toDate();
        }
        return data;
    },
    methods: {
        fetchTableData: function(table, cb){
            var vm = this;
            var params = {"ends_at": moment(vm.ends_at).format()};
            if( vm.timezone !== 'utc' ) {
                params["timezone"] = moment.tz.guess();
            }
            $.get(table.location, params, function(resp){
                var unit = resp.unit;
                var scale = resp.scale;
                scale = parseFloat(scale);
                if( isNaN(scale) ) {
                    scale = 1.0;
                }
                // add "extra" rows at the end
                var extra = resp.extra || [];

                var tableData = {
                    unit: unit,
                    scale: scale,
                    data: resp.table
                }
                vm.convertDatetime(tableData.data, vm.timezone === 'utc');
                vm.$set(vm.tableData, table.key, tableData)

                if(cb) cb();
            });
        },
        endOfMonth: function(date) {
            return new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
            );
        },
        prepareCurrentTabData: function(){
            var vm = this;
            var table = vm.currentTable;
            vm.fetchTableData(table, function(){
                var tableData = vm.currentTableData;
                 // manual binding - trigger updates to the graph
                if( table.key === "balances") {
                    // XXX Hard-coded.
                    updateBarChart("#metrics-chart-" + table.key,
                        tableData.data, tableData.unit, tableData.scale, tableData.extra);
                } else {
                    updateChart("#metrics-chart-" + table.key,
                        tableData.data, tableData.unit, tableData.scale, tableData.extra);
                }
            });
        },
        tabTitle: function(table){
            var filter = Vue.filter('currencyToSymbol');
            var unit = '';
            var tableData = this.tableData[table.key];
            if(tableData && tableData.unit){
                unit = ' (' + filter(tableData.unit) + ')';
            }
            return table.title + unit;
        },
    },
    computed: {
        currentTable: function(){
            return this.tables[this.currentTab];
        },
        currentTableData: function(){
            var res = {data: []}
            var key = this.currentTable.key;
            var data = this.tableData[key];
            if(data){
                res = data;
            }
            return res;
        },
        currentTableDates: function(){
            var res = [];
            var data = this.currentTableData.data;
            if(data && data.length > 0){
                res = data[0].values;
            }
            return res;
        }
    },
    mounted: function(){
        this.prepareCurrentTabData()
    }
})
}

if($('#subscribers-list-container').length > 0){
var app = new Vue({
    el: "#subscribers-list-container",
    mixins: [
        subscriptionsMixin,
        subscribersMixin,
        paginationMixin,
        filterableMixin,
        sortableMixin,
    ],
    data: {
        currentTab: 1,
        registered: {
            url: djaodjinSettings.urls.api_registered,
            results: [],
            count: 0,
            loaded: false
        },
        subscribed: {
            url: djaodjinSettings.urls.saas_api_active_subscribers,
            results: [],
            count: 0,
            loaded: false
        },
        churned: {
            url: djaodjinSettings.urls.saas_api_churned,
            results: [],
            count: 0,
            loaded: false
        },
    },
    methods: {
        get: function(){
            var vm = this;
            var queryset = vm[vm.currentQueryset];
            $.get(queryset.url, vm.params, function(resp){
                queryset.results = resp.results;
                queryset.count = resp.count;
                queryset.loaded = true;
                vm[vm.currentQueryset] = queryset;
            });
        },
        resolve: function (o, s){
            return s.split('.').reduce(function(a, b) {
                return a[b];
            }, o);
        },
        groupBy: function (list, groupBy) {
            var vm = this;
            var res = {};
            var keys = [];
            list.forEach(function(item){
                var value = vm.resolve(item, groupBy);
                keys.push(value);
                res[value] = res[value] || [];
                res[value].push(item);
            });
            var unique_keys = Array.from(new Set(keys));
            var ordered_res = [];
            unique_keys.forEach(function(key){
                ordered_res.push(res[key])
            });
            return ordered_res;
        },
        clearFilters: function(){
            var params = {
                o: 'created_at',
                ot: 'desc',
                q: '',
                page: 1,
            }
            this.params = params;
        },
        tabChanged: function(){
            this.clearFilters();
            this.get();
        },
    },
    computed: {
        totalItems: function(){
            return this[this.currentQueryset].count
        },
        currentQueryset: function(){
            var sets = ['registered', 'subscribed', 'churned']
            return sets[this.currentTab];
        }
    },
    mounted: function(){
        this.get();
    }
})
}

if($('#subscriptions-list-container').length > 0){
var app = new Vue({
    el: "#subscriptions-list-container",
    mixins: [subscriptionsMixin, paginationMixin, itemListMixin],
    data: {
        url: djaodjinSettings.urls.saas_api_subscriptions,
        modalOpen: false,
        plan: {},
        toDelete: {
            plan: null,
            org: null
        },
    },
    methods: {
        update: function(item){
            var vm = this;
            var url = vm.subscriptionURL(
                item.organization.slug, item.plan.slug);
            var data = {
                description: item.description,
                ends_at: item.ends_at
            };
            $.ajax({
                method: 'PATCH',
                url: url,
                data: data,
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        selected: function(idx){
            var item = this.items.results[idx];
            item.ends_at = (new Date(item.ends_at)).toISOString();
            this.update(item);
        },
        subscribersURL: function(provider, plan) {
            return djaodjinSettings.urls.api_organizations + provider + "/plans/" + plan + "/subscriptions/";
        },
        subscribe: function(org){
            var vm = this;
            var url = vm.subscribersURL(vm.plan.organization, vm.plan.slug);
            var data = {
                organization: {
                  slug: org
                }
            }
            $.ajax({
                method: 'POST',
                url: url,
                contentType: 'application/json',
                data: JSON.stringify(data),
            }).done(function (){
                vm.get();
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        unsubscribeConfirm: function(org, plan) {
            this.toDelete = {
                org: org,
                plan: plan
            }
            this.modalOpen = true;
        },
        unsubscribe: function() {
            var vm = this;
            var data = vm.toDelete;
            if(!(data.org && data.plan)) return;
            var url = vm.subscriptionURL(data.org, data.plan);
            $.ajax({
                method: 'DELETE',
                url: url,
            }).done(function (){
                vm.params.page = 1;
                vm.get();
                vm.modalOpen = false;
            }).fail(function(resp){
                showErrorMessages(resp);
                vm.modalOpen = false;
            });
        },
        acceptRequest: function(organization, request_key) {
            var vm = this;
            var url = (djaodjinSettings.urls.api_organizations +
                organization + "/subscribers/accept/" + request_key + "/");
            $.ajax({
                method: 'PUT',
                url: url,
            }).done(function (){
                vm.get();
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
    },
    mounted: function(){
        this.get();
    }
})
}

if($('#import-transaction-container').length > 0){
var app = new Vue({
    el: "#import-transaction-container",
    data: {
        url: djaodjinSettings.urls.saas_api_subscriptions,
        created_at: moment().format("YYYY-MM-DD"),
        itemSelected: '',
        searching: false,
    },
    methods: {
        getSubscriptions: function(query, done) {
            var vm = this;
            vm.searching = true;
            $.get(vm.url, {q: query}, function(res){
                vm.searching = false;
                // current typeahead implementation does not
                // support dynamic keys that's why we are
                // creating them here
                res.results.forEach(function(e){
                    e.itemKey = e.organization.slug + ':' + e.plan.slug
                });
                done(res.results)
            });
        },
    },
});
}

if($('#coupon-users-container').length > 0){
var app = new Vue({
    el: "#coupon-users-container",
    mixins: [itemListMixin, sortableMixin, paginationMixin],
    data: {
        params: {
            o: 'created_at',
            ot: "desc",
        },
        url: djaodjinSettings.urls.api_metrics_coupon_uses
    },
    mounted: function(){
        this.get()
    }
})
}

if($('#billing-statement-container').length > 0){
var app = new Vue({
    el: "#billing-statement-container",
    mixins: [
        itemListMixin,
        sortableMixin,
        paginationMixin,
        filterableMixin
    ],
    data: function(){
        var res = {
            url: djaodjinSettings.urls.api_transactions,
            last4: "N/A",
            exp_date: "N/A",
            cardLoaded: false,
            modalOpen: false,
        }
        return res;
    },
    methods: {
        getParams: function(){
            var params = this.params;
            params.start_at = moment(params.start_at).toISOString();
            params.ends_at = moment(params.ends_at).toISOString();
            return params;
        },
        getCard: function(){
            var vm = this;
            $.get(djaodjinSettings.saas_api_user_card, function(resp){
                if(resp.last4) {
                    vm.last4 = resp.last4;
                }
                if(resp.exp_date) {
                    vm.exp_date = resp.exp_date;
                }
                vm.cardLoaded = true;
            });
        },
        reload: function(){
            this.resetDefaults({
                /*
                TODO
                o: 'created_at',
                ot: 'desc',
                ends_at: moment().toDate(),*/
                url: djaodjinSettings.urls.api_transactions
            });
            this.get();
        },
        cancelBalance: function(){
            var vm = this;
            $.ajax({
                method: 'DELETE',
                url: djaodjinSettings.urls.api_cancel_balance_due,
            }).done(function() {
                vm.reload()
                vm.modalOpen = false
            }).fail(function(resp){
                vm.reload()
                showErrorMessages(resp);
            });
        }
    },
    mounted: function(){
        this.getCard();
        this.get();
    }
})
}

if($('#transfers-container').length > 0){
var app = new Vue({
    el: "#transfers-container",
    mixins: [itemListMixin, sortableMixin, paginationMixin, filterableMixin],
    data: {
        url: djaodjinSettings.urls.api_transactions,
        balanceLoaded: false,
        last4: "N/A",
        bank_name: "N/A",
        balance_amount: "N/A",
        balance_unit: '',
    },
    methods: {
        getBalance: function() {
            var vm = this;
            $.get(djaodjinSettings.urls.saas_api_bank, function(resp){
                vm.balance_amount = resp.balance_amount;
                vm.balance_unit = resp.balance_unit;
                vm.last4 = resp.last4;
                vm.bank_name = resp.bank_name;
                vm.balanceLoaded = true;
            });
        },
        getParams: function(){
            var params = this.params;
            params.start_at = moment(params.start_at).toISOString();
            params.ends_at = moment(params.ends_at).toISOString();
            return params;
        },
    },
    mounted: function(){
        this.getBalance();
        this.get();
    },
})
}

if($('#transactions-container').length > 0){
var app = new Vue({
    el: "#transactions-container",
    mixins: [itemListMixin, sortableMixin, paginationMixin, filterableMixin],
    data: {
        url: djaodjinSettings.urls.api_transactions,
    },
    methods: {
        getParams: function(){
            var params = this.params;
            params.start_at = moment(params.start_at).toISOString();
            params.ends_at = moment(params.ends_at).toISOString();
            return params;
        },
    },
    mounted: function(){
        this.get();
    },
})
}

if($('#accessible-list-container').length > 0){
var app = new Vue({
    el: "#accessible-list-container",
    mixins: [userRelationMixin, sortableMixin, filterableMixin],
    data: {
        params: {
            o: "slug",
            ot: "asc",
        },
        url: djaodjinSettings.urls.api_accessibles,
        typeaheadUrl: djaodjinSettings.urls.api_organizations,
    },
    mounted: function(){
        this.get()
    },
})
}

if($('#plan-subscribers-container').length > 0){
var app = new Vue({
    el: "#plan-subscribers-container",
    mixins: [
        subscriptionsMixin,
        subscribersMixin,
        paginationMixin,
        sortableMixin,
        filterableMixin,
        itemListMixin,
    ],
    data: {
        url: djaodjinSettings.urls.saas_api_plan_subscribers,
    },
    mounted: function(){
        this.get();
    }
})
}

if($('#remove-profile-container').length > 0){
var app = new Vue({
    el: "#remove-profile-container",
    data: {
        modalOpen: false,
    },
    methods: {
        deleteProfile: function(){
            var vm = this;
            $.ajax({
                method: 'DELETE',
                url: djaodjinSettings.urls.saas_api_organization,
            }).done(function() {
                vm.modalOpen = false;
                window.location = djaodjinSettings.urls.user_profile_redirect;
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        }
    },
})
}

if($('#charge-list-container').length > 0){
var app = new Vue({
    el: "#charge-list-container",
    mixins: [
        itemListMixin,
        filterableMixin
    ],
    data: {
        url: djaodjinSettings.urls.api_charges,
    },
    mounted: function(){
        this.get();
    }
})
}

if($('#role-list-container').length > 0){
var app = new Vue({
    el: "#role-list-container",
    mixins: [
        itemListMixin,
        paginationMixin,
    ],
    data: {
        url: djaodjinSettings.urls.saas_api_role_descriptions_url,
        role: {
            title: '',
        },
        modalOpen: false,
    },
    methods: {
        create: function(){
            var vm = this;
            $.ajax({
                method: 'POST',
                url: vm.url,
                data: vm.role,
            }).done(function(resp) {
                vm.role.title = '';
                vm.params.page = 1;
                vm.get()
                vm.modalOpen = false;
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        remove: function(role){
            var vm = this;
            var url = vm.url + "/" + role.slug
            $.ajax({
                method: 'DELETE',
                url: url,
            }).done(function() {
                vm.params.page = 1;
                vm.get()
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
    },
    mounted: function(){
        this.get();
    },
})
}

if($('#balance-list-container').length > 0){
var app = new Vue({
    el: "#balance-list-container",
    mixins: [
        itemListMixin,
        timezoneMixin,
    ],
    data: {
        url: djaodjinSettings.urls.api_broker_balances,
        balanceLineUrl : djaodjinSettings.urls.api_balance_lines,
        startPeriod: moment().subtract(1, 'months').toISOString(),
        balanceLine: {
            title: '',
            selector: '',
            rank: 0,
        },
    },
    computed: {
        values: function(){
            if(this.items.table && this.items.table.length > 0){
                return this.items.table[0].values
            }
            return [];
        }
    },
    methods: {
        getParams: function(){
            var params = this.params;
            params.start_at = moment(params.start_at).toISOString();
            params.ends_at = moment(params.ends_at).toISOString();
            return params;
        },
        create: function(){
            var vm = this;
            $.ajax({
                method: 'POST',
                url: vm.balanceLineUrl,
                data: vm.balanceLine,
            }).done(function (resp) {
                vm.get()
                vm.balanceLine = {
                    title: '',
                    selector: '',
                    rank: 0,
                }
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        remove: function(id){
            var vm = this;
            $.ajax({
                method: 'DELETE',
                url: vm.balanceLineUrl + '/' + id,
            }).done(function() {
                vm.get()
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
    },
    mounted: function(){
        this.get();
    }
})
}

if($('#checkout-container').length > 0){
var app = new Vue({
    el: "#checkout-container",
    mixins: [itemListMixin],
    data: {
        url: djaodjinSettings.urls.api_checkout,
        plansOption: {},
        plansPayer: {},
        coupon: '',
        optionsConfirmed: false,
        getCb: 'getAndPrepareData',
        cardNumber: '',
        cardCvc: '',
        cardExpMonth: '',
        cardExpYear: '',
        name: '',
        addressLine1: '',
        addressCity: '',
        addressZip: '',
        addressCountry: '',
        addressRegion: '',
        haveCardData: false,
        savedCard: {},
        countries: countries,
        regions: regions,
    },
    methods: {
        parseDescr: function(des){
            var res = des.split('(');
            return res[res.length-1].split(' ')[0];
        },
        getOptions: function(){
            var vm = this;
            var res = [];
            vm.items.results.map(function(item, index){
                var plan = item.subscription.plan.slug
                var option = vm.plansOption[plan];
                if(option !== undefined){
                    res[index] = {option: option + 1}
                }
            });
            return res;
        },
        remove: function(plan){
            var vm = this;
            var url = djaodjinSettings.urls.api_cart + plan + '/';
            $.ajax({
                method: 'DELETE',
                url: url,
            }).done(function() {
                vm.get()
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        redeem: function(){
            var vm = this;
            $.ajax({
                method: 'POST',
                url: djaodjinSettings.urls.api_redeem_coupon,
                data: {code: vm.coupon},
            }).done(function(resp) {
                showMessages(["Coupon was successfully applied."], "success");
                vm.get()
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        addPlanUser: function(plan, user){
            var vm = this;
            $.ajax({
                method: 'POST',
                url: djaodjinSettings.urls.api_cart,
                data: {
                    plan: plan,
                    first_name: user.firstName,
                    last_name: user.lastName,
                },
            }).done(function(resp) {
                showMessages(["User was added."], "success");
                vm.get()
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        getAndPrepareData: function(res){
            var results = res.items
            var periods = {}
            var payers = {}
            var optionsConfirmed = results.length > 0 ? true : false;
            results.map(function(e){
                var plan = e.subscription.plan.slug;
                if(e.options.length > 0){
                    optionsConfirmed = false;
                    periods[plan] = 0;
                }
                payers[plan] = {
                    firstName: '', lastName: '', email: ''
                }
            });

            this.items = {
                results: results,
                count: results.length
            }
            this.plansOption = periods;
            this.plansPayer = payers;
            this.itemsLoaded = true;
            this.optionsConfirmed = optionsConfirmed;
        },
        planPayer: function(plan){
            return this.plansPayer[plan] && this.plansPayer[plan] || {}
        },
        activeOption: function(item){
            var index = this.plansOption[item.subscription.plan.slug];
            if(index !== undefined){
                var option = item.options[index];
                if(option) return option;
            }
            return {};
        },
        optionSelected: function(plan, index){
            this.$set(this.plansOption, plan, index);
        },
        isOptionSelected: function(plan, index){
            var selected = this.plansOption[plan];
            return selected !== undefined && selected == index;
        },
        getCardToken: function(cb){
            var vm = this;
            Stripe.setPublishableKey(djaodjinSettings.stripePubKey);
            Stripe.createToken({
                number: vm.cardNumber,
                cvc: vm.cardCvc,
                exp_month: vm.cardExpMonth,
                exp_year: vm.cardExpYear,
                name: vm.name,
                address_line1: vm.addressLine1,
                address_city: vm.addressCity,
                address_state: vm.addressRegion,
                address_zip: vm.addressZip,
                address_country: vm.addressCountry
            }, function(code, res){
                if(code === 200) {
                    if(cb) cb(res.id)
                } else {
                    showMessages([res.error.message], "error");
                }
            });
        },
        getUserCard: function(){
            var vm = this;
            $.ajax({
                method: 'GET',
                url: djaodjinSettings.urls.api_card,
            }).done(function(resp) {
                if(resp.last4){
                    var savedCard = {
                        last4: resp.last4,
                        exp_date: resp.exp_date,
                        card_name: resp.card_name,
                    }
                    vm.savedCard = savedCard;
                    vm.haveCardData = true;
                }
            });
        },
        doCheckout: function(token){
            var vm = this;
            var opts = vm.getOptions();
            var data = {
                remember_card: true,
                items: opts,
            }
            if(token){
                data.processor_token = token;
            }
            $.ajax({
                method: 'POST',
                url: djaodjinSettings.urls.api_checkout,
                contentType: 'application/json',
                data: JSON.stringify(data),
            }).done(function(resp) {
                vm.optionsConfirmed = false;
                showMessages(["Success."], "success");
                vm.get()
            }).fail(function(resp){
                showErrorMessages(resp);
            });
        },
        checkout: function(){
            var vm = this;
            if(vm.haveCardData){
                vm.doCheckout();
            } else {
                vm.getCardToken(vm.doCheckout);
            }
        }
    },
    computed: {
        linesPrice: function(){
            var vm = this;
            var total = 0;
            var unit = 'usd';
            if(this.items.results){
                this.items.results.map(function(e){
                    if(e.options.length > 0){
                        var option = vm.plansOption[e.subscription.plan.slug];
                        if(option !== undefined){
                            total += e.options[option].dest_amount;
                            unit = e.options[option].dest_unit;
                        }
                    }
                    e.lines.map(function(l){
                        total += l.dest_amount;
                        unit = l.dest_unit;
                    });
                });
            }
            return [total / 100, unit];
        }
    },
    mounted: function(){
        this.get()
        this.getUserCard();
    }
})
}

