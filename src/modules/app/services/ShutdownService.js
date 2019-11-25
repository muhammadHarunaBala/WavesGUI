(function () {
    'use strict';

    /**
     * @param {Base} Base
     * @param {IPollCreate} createPoll
     * @param {ConfigService} configService
     * @param {ModalManager} modalManager
     * @return {ShutdownService}
     */
    const factory = function (Base, createPoll, configService, modalManager) {

        class ShutdownService extends Base {

            /**
             * @public
             */
            run() {
                let timerId;
                const tick = () => {
                    this._handleDates(this._getDates());
                    if (timerId) {
                        window.clearInterval(timerId);
                    }
                    timerId = setTimeout(() => tick(), 1000);
                };

                tick();

            }

            /**
             * @return {*}
             * @private
             */
            _getDates() {
                return configService.get('SHUTDOWN_NOTIFICATION_TIMERS');
            }

            /**
             * @param {[{ start: string, end: ?string, action: string }]} timers
             * @private
             */
            _handleDates(timers) {
                const now = Date.now();

                timers.forEach(timer => {
                    const start = new Date(timer.start).getTime();
                    const end = timer.end ? new Date(timer.end).getTime() : Date.now();

                    if (now >= start && now <= end) {
                        if (!sessionStorage.getItem(timer.action)) {
                            sessionStorage.setItem(timer.action, 'true');
                            modalManager[timer.action]();
                        }

                    }
                });
            }


        }

        return new ShutdownService();
    };

    factory.$inject = ['Base', 'createPoll', 'configService', 'modalManager'];

    angular.module('app').factory('shutdownService', factory);
})();

/**
 * @name ShutdownService
 */