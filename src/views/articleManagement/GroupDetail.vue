<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-row>
        <a-col :span='22' style='font-size:30px;font-weight: bold'>组队标题</a-col>
        <a-col :span='2' style='font-size: 20px;font-weight: bold'>组队进度：2/5</a-col>
      </a-row>
      <a-row>
        <a-col :span='2' style='font-size: 20px;font-weight: bold;'>开始时间：</a-col>
        <a-col :span='2' style='color: #909399;'>2021-08-01 22:00:00</a-col>
        <a-col :span='2' :offset='2' style='font-size: 20px;font-weight: bold'>截止时间：</a-col>
        <a-col :span='2' style='color: #909399'>2021-08-22 22:00:00</a-col>
      </a-row>
      <p>浔阳江头夜送客，枫叶荻花秋瑟瑟。主人下马客在船，举酒欲饮无管弦。醉不成欢惨将别，别时茫茫江浸月。

        忽闻水上琵琶声，主人忘归客不发。寻声暗问弹者谁？琵琶声停欲语迟。移船相近邀相见，添酒回灯重开宴。千呼万唤始出来，犹抱琵琶半遮面。转轴拨弦三两声，未成曲调先有情。弦弦掩抑声声思，似诉平生不得志。低眉信手续续弹，说尽心中无限事。轻拢慢捻抹复挑，初为霓裳后六幺。大弦嘈嘈如急雨，小弦切切如私语。嘈嘈切切错杂弹，大珠小珠落玉盘。间关莺语花底滑，幽咽泉流冰下难。冰泉冷涩弦凝绝，凝绝不通声暂歇。别有幽愁暗恨生，此时无声胜有声。银瓶乍破水浆迸，铁骑突出刀枪鸣。曲终收拨当心画，四弦一声如裂帛。东船西舫悄无言，唯见江心秋月白。

        沉吟放拨插弦中，整顿衣裳起敛容。自言本是京城女，家在虾蟆陵下住。十三学得琵琶成，名属教坊第一部。曲罢曾教善才服，妆成每被秋娘妒。五陵年少争缠头，一曲红绡不知数。钿头银篦击节碎，血色罗裙翻酒污。今年欢笑复明年，秋月春风等闲度。弟走从军阿姨死，暮去朝来颜色故。门前冷落鞍马稀，老大嫁作商人妇。商人重利轻别离，前月浮梁买茶去。去来江口守空船，绕船月明江水寒。夜深忽梦少年事，梦啼妆泪红阑干。

        我闻琵琶已叹息，又闻此语重唧唧。同是天涯沦落人，相逢何必曾相识！我从去年辞帝京，谪居卧病浔阳城。浔阳地僻无音乐，终岁不闻丝竹声。住近湓江地低湿，黄芦苦竹绕宅生。其间旦暮闻何物？杜鹃啼血猿哀鸣。春江花朝秋月夜，往往取酒还独倾。岂无山歌与村笛？呕哑嘲哳难为听。今夜闻君琵琶语，如听仙乐耳暂明。莫辞更坐弹一曲，为君翻作《琵琶行》。感我此言良久立，却坐促弦弦转急。凄凄不似向前声，满座重闻皆掩泣。座中泣下谁最多？江州司马青衫湿。</p>
      <div class='pictures'>
        <img src='https://c-ssl.duitang.com/uploads/item/201312/05/20131205171905_2TAzM.thumb.1000_0.jpeg' style='width: 200px'>
      </div>
      <div class='question' style='font-size: 15px;font-weight: bold'>
        <span class='question-title'>问卷问题<br/></span>
        <span v-for='(question,index) in questions' :key='(question,index)'>{{index+1}}.{{question}}<br/></span>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'GroupDetail',
  data () {
    return {
      questions: ['你帅吗？', '你美吗？', '', '', '', '']
    }
  }
}
</script>

<style scoped>

</style>
