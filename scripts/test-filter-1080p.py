import runpy
import unittest
q = runpy.run_path('scripts/filter-1080p.py')['qualifies']
class GateTests(unittest.TestCase):
    def data(self, w=1920, h=1080, field='progressive', interlaced=0):
        return {'streams':[{'width':w,'height':h,'field_order':field}], 'frames':[{'width':w,'height':h,'interlaced_frame':interlaced} for _ in range(25)]}
    def test_progressive(self): self.assertTrue(q(self.data()))
    def test_sd(self): self.assertFalse(q(self.data(720,576)))
    def test_720p(self): self.assertFalse(q(self.data(1280,720)))
    def test_1080i(self): self.assertFalse(q(self.data(field='tt', interlaced=1)))
    def test_unknown(self): self.assertFalse(q(self.data(field='unknown')))
    def test_no_frames(self): self.assertFalse(q({'streams':self.data()['streams']}))
    def test_mixed(self):
        d=self.data();d['frames'][0]['interlaced_frame']=1;self.assertFalse(q(d))
unittest.main()
