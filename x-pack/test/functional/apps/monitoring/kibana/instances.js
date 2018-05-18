/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from 'expect.js';
import { getLifecycleMethods } from '../_get_lifecycle_methods';

export default function ({ getService, getPageObjects }) {
  const clusterOverview = getService('monitoringClusterOverview');
  const instances = getService('monitoringKibanaInstances');
  const kibanaClusterSummaryStatus = getService('monitoringKibanaSummaryStatus');

  describe('Kibana instances listing', () => {
    const { setup, tearDown } = getLifecycleMethods(getService, getPageObjects);

    before(async () => {
      await setup('monitoring/singlecluster-yellow-platinum', {
        from: '2017-08-29 17:24:14.254',
        to: '2017-08-29 17:25:44.142',
      });

      // go to kibana instances
      await clusterOverview.clickKibanaInstances();
      expect(await instances.isOnInstances()).to.be(true);
    });

    after(async () => {
      await tearDown();
    });

    it('Kibana Cluster Summary Status shows correct info', async () => {
      expect(await kibanaClusterSummaryStatus.getContent()).to.eql({
        instances: '1',
        memory: '219.6 MB / 1.4 GB',
        requests: '174',
        connections: '174',
        maxResponseTime: '2203 ms',
        health: 'Health: green',
      });
    });

  });
}