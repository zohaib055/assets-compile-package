$(window).load(function() {

	console.log("server is running");

	var self = {

		initUI: function() {

			$('.field.select').each(function() {

				var _span = $(this).children('span');

				$(this).find('select')
					.on('change', function() {
						_span.html($(this).find('option:selected').html());
					});
//					.trigger('change');
                    _span.html($(this).find('option:selected').html());

			});

			$('.field.textarea').each(function() {

				var _this = $(this);

				$(this).find('textarea')
					.on('focus', function() {
						_this.addClass('focus');
					})
					.on('blur', function() {
						_this.removeClass('focus');
					});

			});

			$('.field.radio, .field.checkbox').each(function() {

				if (!$(this).find('input').data('has-events') || _force) {

					var _input	= $(this).find('input'),
						_label	= $(this).find('label').length > 0 ? $(this).find('label') : $('label[for="'+_input.attr('id')+'"]'),
						_type	= $(this).hasClass('radio') ? 'radio' : 'checkbox',
						_el 	= $('<a data-name="'+_input.attr('name')+'"><span class="bullet" /><span class="text" /></a>').appendTo($(this));

					_input.hide();
					_label.hide();

					_el
						.on('click tap', function(e, _block_event) {

							e.preventDefault();

							if (_type == 'radio') {

								$('.field.'+_type)
									.find('a[data-name="'+$(this).attr('data-name')+'"]')
										.removeClass('selected')
										.end()
									.find('input[name="'+$(this).attr('data-name')+'"]')
										.prop('checked', false);

								_input.prop('checked', true);

								$(this).addClass('selected');

							} else {

								if (_block_event || !_input.is(':checked')) {
									_input.prop('checked', true);
									$(this).addClass('selected');
								} else {
									_input.prop('checked', false);
									$(this).removeClass('selected');
								}

							}

							if (!_block_event)
								_input.trigger('change', [true]);

						})
						.on('mouseover', function() {
							$(this).addClass('hover');
						})
						.on('mouseout', function() {
							$(this).removeClass('hover');
						})
						.append('<span class="clearfix"></span>')
						.find('span.text')
							.html(_label.html());

					_input
						.on('change', function(e, _block_event) {
							if (!_block_event && $(this).is(':checked'))
								_el.trigger('click', [true]);
						})
						.data('has-events', true);

					if (_input.is(':checked'))
						_el.trigger('click', [true]);

				}

			});

			$('.tabs').each(function() {

				var _tabs = $(this).find('a[data-tab]'),
					_containers = {};

				_tabs.each(function() {

					_containers[$(this).data('tab')] = $('div.tab[data-tab="' + $(this).data('tab') + '"]');

					$(this).on('click tap', function(e) {

						e.preventDefault();

						if ($(this).hasClass('active'))
							return;

						_tabs.removeClass('active')
						$(this).addClass('active');

						for (var _k in _containers) {

							if (_k == $(this).data('tab'))
								_containers[_k].fadeIn('fast');
							else
								_containers[_k].hide();

						}

					});

				});

			});

			$('[data-tooltip]').each(function() {
				$(this).tooltipster({
					content: $(this).data('tooltip')
				});
			});

			return self;

		},

		initResults: function() {

			var _global = {
				message: $('form.message'),
				reviews: $('div.box.reviews')
			};

			function resetAll() {
				$('a.bt-message').removeClass('active');
				_global.message.slideUp(500, 'easeInOutCirc');
				_global.reviews.slideUp(500, 'easeInOutCirc', function() {
					$(this).find('form').hide();
				});
			}

			$('div.results div.entry').each(function() {

				var _this = $(this),
					_buttons = {
						message: $(this).find('a.bt-message'),
						reviews: $(this).find('header div.reviews a')
					},
					_boxes = {
						message: $(this).find('form.message'),
						reviews: $(this).find('div.box.reviews')
					};

				// Generic box functions
				$(this).find('.box').find('a.bt-close').on('click tap', function(e) {
					e.preventDefault();
					resetAll();
				});

				// Message
				_buttons.message.on('click tap', function(e) {

					e.preventDefault();

					if (!$(this).hasClass('active')) {

						resetAll();

						$(this).addClass('active');

						_boxes.message.slideDown(500, 'easeInOutCirc', function() {
							_boxes.message.find('textarea').focus();
                                   _boxes.message.find('.btnSendMsg').show();//my code
						});

					} else
						resetAll();

				});

				_boxes.message
					.find('a.bt-close')
						.on('click tap', function(e) {
							_buttons.message.removeClass('active');
						})
						.end()
					.find('div.bt-group a')
						.on('click tap', function(e) {

							e.preventDefault();

							$(this).parent().children('a').removeClass('active');
							$(this).addClass('active');

							_boxes.message
								.find('input.field-reply-by')
									.val($(this).data('value'))
									.end()
								.find('input.field-reply-to')
									.attr('placeholder', $(this).data('placeholder'))
									.focus();

						});

				$(_boxes.message.find('div.bt-group a')[0]).trigger('click');

				// Reviews
				_buttons.reviews.on('click tap', function(e) {

					e.preventDefault();

					if (_boxes.reviews.is(':visible'))
						return;

					resetAll();

					_boxes.reviews.slideDown(500, 'easeInOutCirc');

					window.setTimeout(function() {
						$('html, body').animate({scrollTop: _boxes.reviews.position().top}, 500, 'easeInOutCirc');
					}, 400);

				});

				_boxes.reviews.each(function() {

					var _link_review = $(this).find('div.post > a'),
						_form = $(this).find('form');

					_link_review.on('click tap', function(e) {

						if ($(this).data('logged')) {
							e.preventDefault();
							_form.slideToggle(500, 'easeInOutCirc');
						}

					});

					_form.each(function() {

						var _rating = _form.find('div.rating'),
							_input_rating = _form.find('input.field-rating');

						_rating
							.on('mouseleave', function() {

								$(this).children('a').removeClass('active');

								if ($(this).data('rating'))
									$(this).children('a:lt(' + $(this).data('rating') + ')').addClass('active');

							})
							.find('a.star')
								.each(function() {

									$(this)
										.on('mouseenter', function() {
											$(this).siblings('a').removeClass('active');
											$(this).parent().children('a:lt(' + $(this).index() + ')').addClass('active');
										})
										.on('click tap', function(e) {
											e.preventDefault();
											_rating.data('rating', $(this).data('value'));
											_input_rating.val($(this).data('value'));
										});

								});

					});

				});

			});

			// Content
			$(window).on('resize', function() {

				$('div.results div.entry div.content').each(function() {

					var _this = $(this),
						_maxH = parseInt($(this).css('max-height'));

					$(this).css('max-height', 'none');

					var _height = $(this).outerHeight();

					$(this).css('max-height', _maxH);

					if (_height > _maxH) {

						if ($(this).parent().find('a.read-more').length == 0)
							$('<a class="read-more">Read more</a>')
								.insertAfter($(this))
								.on('click tap', function() {

									$(this).remove();

									_this.css({
										maxHeight: 'none',
										overflow: 'visible',
										height: 'auto'
									});

								});

					} else
						_this.parent().find('a.read-more').remove();

				});

			}).trigger('resize');

			return self;

		},

		initSignin: function() {

			$('body.signin').each(function() {

				var _this = $(this),
					_blocks = $(this).find('div.sign-block'),
					_wrapper = $(this).find('div.wrapper');

				$(this).find('a.link').on('click tap', function(e) {

					e.preventDefault();

					_blocks.hide();
					_this.find('div.sign-block.' + $(this).data('block')).fadeIn('fast');

					$(window).trigger('resize');

				});

				$(window).on('resize', function() {

					var _windowH = $(window).height(),
						_wrapperH = _wrapper.outerHeight(),
						_margin = _wrapperH < _windowH ? (_windowH - _wrapperH) >> 1 : 80;

					_wrapper.css('margin-top', _margin);

				});

				_wrapper.show();
				$(_this.find('a.link[data-block="signin"]')[0]).trigger('click');

			});

			return self;

		},

		initAccount: function() {

			$('body.account').each(function() {

				var _this = $(this),
					_listing = _this.find('div.listing'),
					_entries = _this.find('div[data-profile]');

				_this.find('a.link-edit[data-profile]').on('click tap', function(e) {

					e.preventDefault();

					_listing.hide();
					_entries.hide();

					_this.find('div[data-profile="' + $(this).data('profile') + '"]').fadeIn('fast');

				});


				_listing.find('a.link-toggle').on('click tap', function(e) {

					e.preventDefault();

					// TODO: handle backend; on success, run code below:

					var _li = $(this).parents('li');

					_li.toggleClass('disabled');
					$(this).html((_li.hasClass('disabled') ? 'Enable' : 'Disable') + ' profile');

				});


				_entries.each(function() {

					var _entry = $(this);

					_entry.find('a.bt-back').on('click tap', function(e) {

						e.preventDefault();

						_entries.hide();
						_listing.fadeIn('fast');

					});

					_entry.find('div.tags').each(function() {

						var _holder = $(this).find('div.badges'),
							_bt_add = $(this).children('a.link-add-tag'),
							_input_new = $(this).find('input.field-new-tag'),
							_input_hidden = $(this).find('input.field-tags'),
							deleteTag = function(e) {

								e.preventDefault();

								var _index = _tags.indexOf($(this).data('tag'));

								if (_index >= 0) {
									_tags.splice(_index, 1);
									rebuildTags(_tags, _holder);
								}

							},
							_tags = [];


						// tags helper
						function rebuildTags() {

							_holder.html('');

							for (var i = 0; i < _tags.length; i++)
								_holder.append('<a class="badge" data-tooltip="Remove tag" data-tag="' + _tags[i] + '">' + _tags[i] + ' <span>&times;</span></a>');

							_input_hidden.val(_tags.join(','));
							_holder.children('a.badge').on('click tap', deleteTag);

						}


						_bt_add.on('click tap', function(e) {

							e.preventDefault();

							var _val = _input_new.val().trim();

							if (_val && _tags.indexOf(_val) < 0) {
								_tags.push(_val);
								rebuildTags(_tags, _holder);
								_input_new.val('');
							}

						});

						_input_new.on('keypress', function(e) {

							if (e.keyCode == 13) {
								e.preventDefault();
								_bt_add.trigger('click');
							}

						});

						// initializing
						_holder.children('a.badge').each(function() {

							if (_tags.indexOf($(this).data('tag')) < 0) {

								_tags.push($(this).data('tag'));
								$(this).on('click tap', deleteTag);

							} else
								$(this).remove();

						});

					});

				});

			});

			return self;

		},

		init: function() {

			self.initUI()
				.initResults()
				.initSignin()
				.initAccount();

		}

	};

	self.init();

});