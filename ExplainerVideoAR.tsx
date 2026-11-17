import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from 'remotion';
import {
  Background,
  C,
  CLAMP,
  CheckCircle,
  HEIGHT,
  IconAge,
  IconApple,
  IconBP,
  IconCholesterol,
  IconCouch,
  IconCup,
  IconDrop,
  IconFamily,
  IconGlass,
  IconGlobe,
  IconHeart,
  IconMeter,
  IconMoon,
  IconPregnancy,
  IconRunner,
  IconSmoke,
  IconVenus,
  IconWeight,
  Lock,
  Person,
  SceneFade,
  WIDTH,
  fadeUp,
  lerp,
  polar,
  pop,
  prog,
} from './ExplainerVideo';
import {DUR, K, TOTAL_FRAMES} from './timing-ar';
import voiceoverAr from './voiceover-ar.mp3';

/* -------------------------------------------------------------------------- */
/*  Arabic helpers                                                            */
/* -------------------------------------------------------------------------- */

const AR = "'Noto Naskh Arabic', 'Noto Sans Arabic', 'DejaVu Sans', sans-serif";

// Left-to-right isolate: keeps numbers / Latin abbreviations in their natural order
const LTR = (t: string): string => `\u2066${t}\u2069`;

const RTL: React.CSSProperties = {direction: 'rtl', unicodeBidi: 'plaintext'};

type Align = 'right' | 'left' | 'middle';

/** SVG text for right-to-left text. `align` is the PHYSICAL side the text is anchored to. */
const AText: React.FC<{
  x: number;
  y: number;
  size: number;
  fill: string;
  weight?: number;
  align?: Align;
  opacity?: number;
  transform?: string;
  children: React.ReactNode;
}> = ({x, y, size, fill, weight = 700, align = 'middle', opacity = 1, transform, children}) => (
  <text
    x={x}
    y={y}
    fontFamily={AR}
    fontSize={size}
    fontWeight={weight}
    fill={fill}
    opacity={opacity}
    transform={transform}
    textAnchor={align === 'right' ? 'start' : align === 'left' ? 'end' : 'middle'}
    style={{direction: 'rtl', unicodeBidi: 'embed'}}
  >
    {children}
  </text>
);

const arcRev = (cx: number, cy: number, r: number, a1: number, a2: number): string => {
  const p1 = polar(cx, cy, r, a1);
  const p2 = polar(cx, cy, r, a2);
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 0 ${p2.x} ${p2.y}`;
};

/* -------------------------------------------------------------------------- */
/*  Shared pieces (Arabic)                                                    */
/* -------------------------------------------------------------------------- */

const ProgressBarAR: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 10,
        backgroundColor: '#C9DCF0',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div style={{width: `${(f / TOTAL_FRAMES) * 100}%`, height: '100%', backgroundColor: C.teal}} />
    </div>
  );
};

const TitleAR: React.FC<{text: string; color?: string}> = ({text, color = C.navy}) => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 24);
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: AR,
        fontWeight: 700,
        fontSize: 70,
        lineHeight: 1.5,
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * -18}px)`,
        ...RTL,
      }}
    >
      {text}
    </div>
  );
};

type CapItem = {from: number; text: string};

const CAPTION_STYLE: React.CSSProperties = {
  backgroundColor: C.white,
  border: `2px solid ${C.line}`,
  borderRadius: 20,
  padding: '8px 42px 14px',
  fontFamily: AR,
  fontSize: 40,
  lineHeight: 1.55,
  color: C.navy,
  textAlign: 'center',
  maxWidth: 1560,
  boxShadow: '0 4px 14px rgba(27,58,107,0.08)',
  ...RTL,
};

const CaptionAR: React.FC<{items: CapItem[]}> = ({items}) => {
  const f = useCurrentFrame();
  let idx = -1;
  items.forEach((it, i) => {
    if (f >= it.from) idx = i;
  });
  if (idx < 0) return null;
  const t = f - items[idx].from;
  const cur = interpolate(t, [0, 10], [0, 1], CLAMP);
  const wrap = (text: string, opacity: number, dy: number) => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 40,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${dy}px)`,
      }}
    >
      <div style={CAPTION_STYLE}>{text}</div>
    </div>
  );
  return (
    <>
      {idx > 0 && wrap(items[idx - 1].text, 1 - cur, 0)}
      {wrap(items[idx].text, cur, (1 - cur) * 8)}
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*  Scene 1: Intro                                                            */
/* -------------------------------------------------------------------------- */

const IntroAR: React.FC = () => {
  const f = useCurrentFrame();
  const flagged = [7, 16];

  return (
    <AbsoluteFill>
      <TitleAR text="ما قبل السكري: هل أنت معرّض للخطر؟" />
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', left: 0, top: 0}}>
        {Array.from({length: 20}, (_, i) => {
          const c = i % 5;
          const r = Math.floor(i / 5);
          const x = 1590 - c * 125;
          const y = 300 + r * 150;
          const p = pop(f, 22 + i * 4);
          const isFlag = flagged.includes(i);
          const hl = isFlag ? prog(f, K.i2 - 10, 24) : 0;
          const color = interpolateColors(hl, [0, 1], [C.navy, C.red]);
          const badge = isFlag ? pop(f, K.i3 + (i === 7 ? 0 : 14)) : 0;
          return (
            <g key={i}>
              <Person x={x} y={y} color={color} s={Math.max(0, p) * (1 + hl * 0.08)} />
              {isFlag && badge > 0 && (
                <g transform={`translate(${x - 26} ${y - 54}) scale(${badge})`}>
                  <circle r={17} fill={C.orange} stroke="#fff" strokeWidth={3} />
                  <text y={7} textAnchor="middle" fontFamily={AR} fontWeight={700} fontSize={24} fill="#fff">
                    ؟
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 190,
          width: 900,
          fontFamily: AR,
          textAlign: 'right',
          ...RTL,
        }}
      >
        <div
          style={{
            fontSize: 170,
            fontWeight: 700,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            color: C.red,
            opacity: prog(f, K.i2 + 5, 24),
            transform: `scale(${0.88 + 0.12 * prog(f, K.i2 + 5, 24)})`,
            transformOrigin: 'right center',
          }}
        >
          1 من 10
        </div>
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.45,
            color: C.navy,
            ...fadeUp(prog(f, K.i2 + 30, 24)),
          }}
        >
          بالغين حول العالم لديهم ما قبل السكري
        </div>
        <div style={{fontSize: 40, color: C.gray, marginTop: 10, lineHeight: 1.5, ...fadeUp(prog(f, K.i2 + 70, 24))}}>
          أي أكثر من 500 مليون شخص
        </div>
        <div
          style={{
            fontSize: 50,
            fontWeight: 700,
            color: C.orange,
            marginTop: 18,
            lineHeight: 1.5,
            ...fadeUp(prog(f, K.i3, 24)),
          }}
        >
          معظمهم لا يعرفون ذلك
        </div>
        <div
          style={{
            fontSize: 50,
            fontWeight: 700,
            color: C.teal,
            lineHeight: 1.5,
            ...fadeUp(prog(f, K.i3 + 50, 24)),
          }}
        >
          وغالبًا بلا أعراض
        </div>
      </div>

      <CaptionAR
        items={[
          {from: K.i1, text: 'ملايين البالغين حول العالم لديهم حالة صحية لا يشعرون بها.'},
          {from: K.i2, text: 'واحد من كل عشرة بالغين لديه ما قبل السكري.'},
          {from: K.i3, text: 'ومعظمهم لا يعرفون ذلك، فغالبًا لا توجد أعراض.'},
        ]}
      />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------- */
/*  Scene 2: Gauge (mirrored so the scale reads right-to-left)                */
/* -------------------------------------------------------------------------- */

const GaugeAR: React.FC = () => {
  const f = useCurrentFrame();
  const cx = 1010;
  const cy = 610;
  const R = 330;

  const segs = [
    {a1: 0, a2: 52, color: C.teal, start: 20},
    {a1: 56, a2: 124, color: C.orange, start: 42},
    {a1: 128, a2: 180, color: C.red, start: 64},
  ];

  const needleAngle = interpolate(
    f,
    [K.g2 - 7, K.g2 + 28, K.g3 - 13, K.g3 + 27, K.g4 - 10, K.g4 + 30],
    [0, 26, 26, 90, 90, 152],
    {...CLAMP, easing: Easing.inOut(Easing.cubic)},
  );
  const tip = polar(cx, cy, 265, needleAngle);
  const labelOpacity = prog(f, 75, 24);

  const legend = [
    {color: C.teal, text: `أقل من ${LTR('5.7%')}`, x: 1440, start: K.g2 + 10},
    {color: C.orange, text: LTR('5.7% – 6.4%'), x: 1020, start: K.g3 + 20},
    {color: C.red, text: `${LTR('6.5%')} أو أكثر`, x: 620, start: K.g4 + 15},
  ];

  return (
    <AbsoluteFill>
      <TitleAR text="ما هو ما قبل السكري؟" />
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', left: 0, top: 0}}>
        {segs.map((s, i) => (
          <path
            key={i}
            d={arcRev(cx, cy, R, s.a1, s.a2)}
            pathLength={1}
            stroke={s.color}
            strokeWidth={56}
            fill="none"
            strokeDasharray={1}
            strokeDashoffset={1 - prog(f, s.start, 32)}
          />
        ))}

        <AText x={cx + R + 80} y={cy - 140} size={44} fill={C.navy} align="left" opacity={labelOpacity}>
          طبيعي
        </AText>
        <AText x={cx} y={cy - R - 62} size={44} fill={C.navy} align="middle" opacity={labelOpacity}>
          ما قبل السكري
        </AText>
        <AText x={cx - R - 80} y={cy - 140} size={44} fill={C.navy} align="right" opacity={labelOpacity}>
          السكري
        </AText>

        <g opacity={prog(f, 100, 12)}>
          <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke={C.navy} strokeWidth={9} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={21} fill="#3A5A8C" />
        </g>

        <AText x={cx} y={cy + 105} size={50} fill={C.navy} opacity={labelOpacity}>
          {`سكر الدم ${LTR('(HbA1C)')}`}
        </AText>

        <g opacity={prog(f, 88, 24)} transform="translate(1720 600)">
          <g transform="translate(-55 -80) scale(1.7)">
            <IconDrop size={64} />
          </g>
          <AText x={0} y={108} size={32} fill={C.navy}>
            تحليل السكر التراكمي
          </AText>
          <AText x={0} y={150} size={32} fill={C.navy}>
            {LTR('HbA1C')}
          </AText>
        </g>

        {legend.map((l, i) => {
          const p = prog(f, l.start, 20);
          return (
            <g key={i} opacity={p} transform={`translate(${l.x} ${800 + (1 - p) * 14})`}>
              <circle cx={0} cy={-12} r={13} fill={l.color} />
              <AText x={-26} y={0} size={38} fill={C.navy} align="right">
                {l.text}
              </AText>
            </g>
          );
        })}
      </svg>
      <CaptionAR
        items={[
          {from: K.g1, text: 'ما قبل السكري: سكر دم أعلى من الطبيعي، لكنه ليس سكريًا بعد.'},
          {from: K.g2, text: `ويُظهر لك تحليل السكر التراكمي ${LTR('(HbA1C)')} أين تقف.`},
          {from: K.g3, text: `من ${LTR('5.7%')} إلى ${LTR('6.4%')}: ما قبل السكري.`},
          {from: K.g4, text: `و${LTR('6.5%')} أو أكثر: سكري.`},
        ]}
      />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------- */
/*  Scene 3: Inside the body (diagram mirrored, text kept readable)           */
/* -------------------------------------------------------------------------- */

const KeyAR: React.FC<{x: number; y: number; rot: number; fill: string; opacity: number}> = ({
  x,
  y,
  rot,
  fill,
  opacity,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
    <rect x={-65} y={-23} width={130} height={46} rx={23} fill={fill} />
    <text
      transform="scale(-1 1)"
      x={0}
      y={11}
      textAnchor="middle"
      fontFamily={AR}
      fontWeight={700}
      fontSize={30}
      fill="#fff"
    >
      إنسولين
    </text>
  </g>
);

const BodyAR: React.FC = () => {
  const f = useCurrentFrame();
  const OFF = 940;
  const doorY = 525;
  const cellX = 520;
  const M = (x: number) => 1920 - x; // mirrored x for text placed outside the flipped group

  const panelIn = prog(f, 10, 24);

  const healthyKeyT = prog(f, K.b2 + 2, 40);
  const healthyOpen = prog(f, K.b2 + 44, 18);
  const healthyLockColor = interpolateColors(healthyOpen, [0, 1], ['#9FB3CC', C.teal]);
  const targets: Array<[number, number]> = [
    [610, 470],
    [700, 455],
    [770, 505],
    [650, 545],
    [740, 555],
  ];

  const resKeyT = prog(f, K.b3 + 5, 40);
  const resReject = prog(f, K.b3 + 56, 26);
  const resLockColor = interpolateColors(prog(f, K.b3 + 52, 14), [0, 1], ['#9FB3CC', C.red]);
  const xPop = pop(f, K.b3 + 56);

  const dotPos = (i: number, off: number, healthy: boolean) => {
    const sx = 250 + off;
    const sy = 450 + i * 40;
    if (healthy) {
      const t0 = K.b2 + 62 + i * 14;
      const t = prog(f, t0, 62);
      const door = {x: cellX + off, y: doorY};
      const [tx, ty] = targets[i];
      if (t < 0.45) {
        const k = t / 0.45;
        return {x: lerp(sx, door.x - 12, k), y: lerp(sy, door.y, k)};
      }
      const k = (t - 0.45) / 0.55;
      const settle = prog(f, t0 + 62, 10);
      return {
        x: lerp(door.x - 12, tx, k) + Math.sin((f + i * 9) / 11) * 4 * settle,
        y: lerp(door.y, ty, k) + Math.cos((f + i * 7) / 12) * 4 * settle,
      };
    }
    const t0 = K.b3 + 65 + i * 10;
    const t = prog(f, t0, 55);
    const stop = {x: cellX + off - 25, y: doorY + (i - 2) * 16};
    const rest = {x: 1330 + (i % 3) * 40, y: 440 + i * 44};
    const wig = prog(f, t0 + 55, 15);
    if (t < 0.55) {
      const k = t / 0.55;
      return {x: lerp(sx, stop.x, k), y: lerp(sy, stop.y, k)};
    }
    const k = (t - 0.55) / 0.45;
    return {
      x: lerp(stop.x, rest.x, k) + Math.sin((f + i * 9) / 10) * 5 * wig,
      y: lerp(stop.y, rest.y, k) + Math.cos((f + i * 6) / 9) * 5 * wig,
    };
  };

  const arrowP = prog(f, K.b4 + 10, 55);

  return (
    <AbsoluteFill>
      <TitleAR text="ماذا يحدث داخل الجسم؟" />
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', left: 0, top: 0}}>
        {/* diagram geometry, flipped horizontally so the story starts on the right */}
        <g transform="translate(1920 0) scale(-1 1)">
          <g opacity={panelIn}>
            <rect
              x={cellX}
              y={410}
              width={300}
              height={230}
              rx={30}
              fill={interpolateColors(prog(f, K.b2 + 70, 60), [0, 1], ['#FFFFFF', '#DDF6F3'])}
              stroke={C.teal}
              strokeWidth={5}
            />
            <rect x={cellX + OFF} y={410} width={300} height={230} rx={30} fill="#fff" stroke={C.red} strokeWidth={5} />
          </g>

          <Lock x={cellX} y={doorY - 14} color={healthyLockColor} open={healthyOpen} />
          <Lock x={cellX + OFF} y={doorY - 14} color={resLockColor} open={0} />

          <KeyAR
            x={lerp(300, 440, healthyKeyT)}
            y={lerp(345, doorY, healthyKeyT)}
            rot={lerp(-28, 0, healthyKeyT)}
            fill={C.blue}
            opacity={prog(f, K.b2 - 18, 16)}
          />
          <KeyAR
            x={lerp(1240, 1380, resKeyT) - 85 * resReject}
            y={lerp(345, doorY, resKeyT) + 34 * resReject}
            rot={lerp(-28, 0, resKeyT) + 20 * resReject}
            fill={interpolateColors(resReject, [0, 1], [C.blue, '#A9B7C9'])}
            opacity={prog(f, K.b3 - 15, 16) * (1 - 0.4 * resReject)}
          />

          <g transform={`translate(${cellX + OFF - 52} ${doorY - 6}) scale(${xPop})`}>
            <path d="M -22 -22 L 22 22 M 22 -22 L -22 22" stroke={C.red} strokeWidth={9} strokeLinecap="round" />
          </g>

          {[0, 1, 2, 3, 4].map((i) => {
            const a = dotPos(i, 0, true);
            const b = dotPos(i, OFF, false);
            const o = prog(f, 12 + i * 3, 18);
            return (
              <g key={i} opacity={o}>
                <circle cx={a.x} cy={a.y} r={15} fill={C.orange} />
                <circle cx={b.x} cy={b.y} r={15} fill={C.orange} />
              </g>
            );
          })}

          <g opacity={arrowP}>
            <line x1={1105} y1={640} x2={1105} y2={640 - 220 * arrowP + 28} stroke={C.red} strokeWidth={9} strokeLinecap="round" />
            <polygon
              points={`1105,${640 - 220 * arrowP} 1083,${640 - 220 * arrowP + 38} 1127,${640 - 220 * arrowP + 38}`}
              fill={C.red}
            />
          </g>
        </g>

        {/* text, placed at mirrored positions */}
        <g opacity={panelIn}>
          <AText x={M(535)} y={290} size={56} fill={C.teal}>
            خلايا سليمة
          </AText>
          <AText x={M(1475)} y={290} size={52} fill={C.red}>
            خلايا لا تستجيب
          </AText>
          <AText x={M(cellX + 150)} y={625} size={34} fill={C.navy}>
            الخلية
          </AText>
          <AText x={M(cellX + OFF + 150)} y={625} size={34} fill={C.navy}>
            الخلية
          </AText>
          <AText x={M(250)} y={695} size={28} fill={C.gray} weight={400}>
            سكر
          </AText>
          <AText x={M(250 + OFF)} y={695} size={28} fill={C.gray} weight={400}>
            سكر
          </AText>
        </g>
        <AText x={M(535)} y={752} size={40} fill={C.teal} opacity={prog(f, K.b2 + 110, 24)}>
          السكر يدخل إلى الخلايا
        </AText>
        <AText x={M(1475)} y={752} size={40} fill={C.red} opacity={prog(f, K.b4 + 30, 24)}>
          السكر يبقى في الدم
        </AText>
      </svg>
      <CaptionAR
        items={[
          {from: K.b1, text: 'فماذا يحدث داخل الجسم؟'},
          {from: K.b2, text: 'الإنسولين مفتاح يُدخل السكر إلى الخلايا.'},
          {from: K.b3, text: 'لكن أحيانًا لا تستجيب الخلايا له.'},
          {from: K.b4, text: 'فيبقى السكر في الدم ويرتفع مستواه.'},
        ]}
      />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------- */
/*  Scene 4: Risk factors (one sequence)                                      */
/* -------------------------------------------------------------------------- */

type RiskItem = {icon: React.ReactNode; label: string; desc: string; start: number};

const RiskCardAR: React.FC<{item: RiskItem}> = ({item}) => {
  const f = useCurrentFrame();
  const p = pop(f, item.start);
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '0 22px',
        backgroundColor: C.white,
        border: `2.5px solid ${C.navy}`,
        borderRadius: 22,
        opacity: Math.min(1, p * 1.6),
        transform: `scale(${0.88 + 0.12 * Math.min(1.05, p)}) translateY(${(1 - Math.min(1, p)) * 18}px)`,
        ...RTL,
      }}
    >
      <div style={{width: 72, height: 72, flexShrink: 0}}>{item.icon}</div>
      <div style={{fontFamily: AR, minWidth: 0, textAlign: 'right'}}>
        <div style={{fontSize: 34, fontWeight: 700, color: C.navy, lineHeight: 1.3}}>{item.label}</div>
        <div style={{fontSize: 24, color: C.gray, lineHeight: 1.3}}>{item.desc}</div>
      </div>
    </div>
  );
};

const RiskColumnAR: React.FC<{pill: string; color: string; pillStart: number; items: RiskItem[]}> = ({
  pill,
  color,
  pillStart,
  items,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, pillStart, 22);
  return (
    <div style={{width: 570, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div
        style={{
          fontFamily: AR,
          fontWeight: 700,
          fontSize: 28,
          color: '#fff',
          backgroundColor: color,
          padding: '0 30px 6px',
          borderRadius: 999,
          height: 46,
          lineHeight: '46px',
          opacity: p,
          transform: `translateY(${(1 - p) * -10}px)`,
          ...RTL,
        }}
      >
        {pill}
      </div>
      <div style={{marginTop: 16, width: '100%', height: 520, display: 'flex', flexDirection: 'column', gap: 12}}>
        {items.map((it) => (
          <RiskCardAR key={it.label} item={it} />
        ))}
      </div>
    </div>
  );
};

const RisksAR: React.FC = () => {
  const f = useCurrentFrame();

  const fixed: RiskItem[] = [
    {icon: <IconAge />, label: 'التقدّم في العمر', desc: 'يزداد الخطر خصوصًا بعد 35–45 سنة', start: K.r1 + 8},
    {icon: <IconFamily />, label: 'التاريخ العائلي', desc: 'والد أو شقيق مصاب بالسكري من النوع 2', start: K.r1 + 40},
    {icon: <IconGlobe />, label: 'الخلفية العرقية', desc: 'بعض المجموعات أكثر عرضة', start: K.r1 + 72},
  ];
  const habits: RiskItem[] = [
    {icon: <IconWeight />, label: 'زيادة الوزن', desc: 'خاصة حول البطن', start: K.r2 + 6},
    {icon: <IconCouch />, label: 'قلة الحركة', desc: 'نشاط بدني قليل', start: K.r2 + 34},
    {icon: <IconCup />, label: 'كثرة السكريات', desc: 'مشروبات ووجبات خفيفة محلاة', start: K.r2 + 62},
    {icon: <IconSmoke />, label: 'التدخين', desc: 'يرفع خطر السكري من النوع 2', start: K.r2 + 90},
    {icon: <IconMoon />, label: 'قلة النوم', desc: 'نوم قليل أو متقطع', start: K.r2 + 118},
  ];
  const conditions: RiskItem[] = [
    {icon: <IconBP />, label: 'ارتفاع ضغط الدم', desc: `غالبًا ${LTR('130/80')} أو أعلى`, start: K.r3 + 6},
    {icon: <IconCholesterol />, label: 'اضطراب الكوليسترول', desc: 'انخفاض الجيد أو ارتفاع الضار', start: K.r3 + 32},
    {icon: <IconVenus />, label: `تكيّس المبايض ${LTR('(PCOS)')}`, desc: 'اضطراب هرموني شائع لدى النساء', start: K.r3 + 58},
    {icon: <IconPregnancy />, label: 'ارتفاع السكر', desc: 'أثناء حمل سابق', start: K.r3 + 84},
  ];

  const meterIn = prog(f, K.r4 - 6, 24);
  const marker = prog(f, K.r4 + 10, 150);
  const bannerP = prog(f, K.r5, 24);
  const markerColor = interpolateColors(marker, [0, 0.5, 1], [C.teal, C.orange, C.red]);

  return (
    <AbsoluteFill>
      <TitleAR text="ما الذي يرفع خطر إصابتك؟" />

      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 130,
          width: 1780,
          display: 'flex',
          justifyContent: 'space-between',
          direction: 'rtl',
        }}
      >
        <RiskColumnAR pill="خارج عن إرادتك" color={C.red} pillStart={K.r1 - 4} items={fixed} />
        <RiskColumnAR pill="عادات يمكنك تغييرها" color={C.teal} pillStart={K.r2 - 6} items={habits} />
        <RiskColumnAR pill="حالات صحية" color={C.blue} pillStart={K.r3 - 8} items={conditions} />
      </div>

      <div style={{position: 'absolute', left: 460, top: 752, width: 1000, fontFamily: AR, opacity: meterIn, direction: 'rtl'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 26, color: C.gray, lineHeight: 1.4}}>
          <span>خطر أقل</span>
          <span style={{fontWeight: 700, color: C.navy}}>عوامل الخطر تتراكم</span>
          <span>خطر أعلى</span>
        </div>
        <div
          style={{
            position: 'relative',
            marginTop: 6,
            height: 22,
            borderRadius: 11,
            background: `linear-gradient(270deg, ${C.teal}, ${C.orange}, ${C.red})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -8,
              left: (1 - marker) * 962,
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: markerColor,
              border: `5px solid ${C.white}`,
              boxShadow: `0 0 0 3px ${C.navy}`,
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 838,
          display: 'flex',
          justifyContent: 'center',
          ...fadeUp(bannerP),
        }}
      >
        <div
          style={{
            fontFamily: AR,
            fontWeight: 700,
            fontSize: 36,
            lineHeight: 1.5,
            color: C.navy,
            backgroundColor: '#FDE9C9',
            border: `3px solid ${C.orange}`,
            borderRadius: 16,
            padding: '2px 34px 8px',
            ...RTL,
          }}
        >
          خطر مرتفع = تحذير، وليس تشخيصًا
        </div>
      </div>

      <CaptionAR
        items={[
          {from: K.r1, text: 'بعض عوامل الخطر خارجة عن إرادتك.'},
          {from: K.r2, text: 'وبعضها من عاداتك اليومية، ويمكنك تغييرها.'},
          {from: K.r3, text: 'وهناك حالات صحية ترفع الخطر أيضًا.'},
          {from: K.r4, text: 'وكلما زادت عوامل الخطر، زاد احتمال الإصابة بما قبل السكري ثم السكري.'},
          {from: K.r5, text: 'لكن الخطر المرتفع تحذير، وليس تشخيصًا.'},
        ]}
      />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------- */
/*  Scene 5: How do you find out?                                             */
/* -------------------------------------------------------------------------- */

const RangeBoxAR: React.FC<{
  label: string;
  value: string;
  sub?: string;
  color: string;
  tint: string;
  p: number;
}> = ({label, value, sub, color, tint, p}) => (
  <div
    style={{
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: tint,
      borderRight: `8px solid ${color}`,
      borderRadius: 14,
      padding: '4px 20px 8px',
      minHeight: 118,
      opacity: p,
      transform: `translateX(${(1 - p) * 16}px)`,
      textAlign: 'right',
      ...RTL,
    }}
  >
    <div style={{fontSize: 26, fontWeight: 700, color, lineHeight: 1.4}}>{label}</div>
    <div style={{fontSize: 38, fontWeight: 700, color: C.navy, lineHeight: 1.3}}>{value}</div>
    <div style={{fontSize: 22, color: C.gray, lineHeight: 1.3, minHeight: 29}}>{sub ?? ''}</div>
  </div>
);

const TestsAR: React.FC = () => {
  const f = useCurrentFrame();

  const cards = [
    {
      name: `تحليل ${LTR('HbA1C')}`,
      desc: 'متوسط سكر الدم خلال 2–3 أشهر',
      normal: `أقل من ${LTR('5.7%')}`,
      pre: LTR('5.7% – 6.4%'),
      normalSub: undefined as string | undefined,
      preSub: undefined as string | undefined,
      icon: <IconDrop size={110} />,
      start: K.t1,
    },
    {
      name: 'سكر الدم الصائم',
      desc: 'سكر الدم بعد الصيام طوال الليل',
      normal: `أقل من ${LTR('100 mg/dL')}`,
      pre: LTR('100 – 125 mg/dL'),
      normalSub: undefined as string | undefined,
      preSub: LTR('(5.6 – 6.9 mmol/L)'),
      icon: <IconMeter size={110} />,
      start: K.t2,
    },
    {
      name: 'اختبار تحمّل الغلوكوز',
      desc: 'سكر الدم قبل شرب محلول سكري وبعد ساعتين منه',
      normal: `أقل من ${LTR('140 mg/dL')}`,
      pre: LTR('140 – 199 mg/dL'),
      normalSub: undefined as string | undefined,
      preSub: LTR('(7.8 – 11.0 mmol/L)'),
      icon: <IconGlass size={110} />,
      start: K.t3,
    },
  ];
  // mmol/L helper lines for the "Normal" boxes
  cards[1].normalSub = `(أقل من ${LTR('5.6 mmol/L')})`;
  cards[2].normalSub = `(أقل من ${LTR('7.8 mmol/L')})`;

  return (
    <AbsoluteFill>
      <TitleAR text="كيف تعرف ذلك؟" />
      <div
        style={{
          position: 'absolute',
          left: 115,
          top: 175,
          width: 1690,
          display: 'flex',
          justifyContent: 'space-between',
          direction: 'rtl',
          fontFamily: AR,
        }}
      >
        {cards.map((c) => {
          const p = pop(f, c.start);
          const r1 = prog(f, c.start + 36, 24);
          const r2 = prog(f, c.start + 60, 24);
          return (
            <div
              key={c.name}
              style={{
                width: 530,
                height: 612,
                boxSizing: 'border-box',
                padding: '26px 34px 28px',
                backgroundColor: C.white,
                border: `3px solid ${C.navy}`,
                borderRadius: 28,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: Math.min(1, p * 1.6),
                transform: `scale(${0.9 + 0.1 * Math.min(1.05, p)}) translateY(${(1 - Math.min(1, p)) * 24}px)`,
                ...RTL,
              }}
            >
              <div style={{height: 112, display: 'flex', alignItems: 'center'}}>{c.icon}</div>
              <div style={{fontSize: 44, fontWeight: 700, color: C.navy, marginTop: 6, lineHeight: 1.5, textAlign: 'center'}}>
                {c.name}
              </div>
              <div
                style={{
                  fontSize: 24,
                  lineHeight: 1.5,
                  color: C.gray,
                  textAlign: 'center',
                  height: 76,
                  padding: '0 4px',
                }}
              >
                {c.desc}
              </div>
              <div style={{width: '100%', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14}}>
                <RangeBoxAR label="طبيعي" value={c.normal} sub={c.normalSub} color={C.teal} tint="#E3F8F5" p={r1} />
                <RangeBoxAR label="ما قبل السكري" value={c.pre} sub={c.preSub} color={C.orange} tint="#FFF1DA" p={r2} />
              </div>
            </div>
          );
        })}
      </div>
      <CaptionAR
        items={[
          {from: K.t1, text: 'التحليل التراكمي يُظهر متوسط السكر خلال شهرين إلى ثلاثة.'},
          {from: K.t2, text: 'وتحليل السكر الصائم يقيسه بعد صيام الليل.'},
          {from: K.t3, text: 'واختبار التحمّل يقيسه بعد شرب مشروب سكري.'},
          {from: K.t4, text: 'وإن وُجدت عوامل خطر، فاسأل طبيبك عن الفحص.'},
        ]}
      />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------- */
/*  Scene 6: The good news                                                    */
/* -------------------------------------------------------------------------- */

const GoodAR: React.FC = () => {
  const f = useCurrentFrame();
  const pct = Math.round(58 * prog(f, 25, 85));
  const heart = pop(f, 8);
  const beat = 1 + Math.sin(f / 7) * 0.03;

  const actions = [
    {icon: <IconWeight size={64} />, text: `اخسر ${LTR('5–7%')} من وزن جسمك`, start: K.o2},
    {icon: <IconRunner size={64} />, text: `${LTR('150')} دقيقة نشاط بدني أسبوعيًا`, start: K.o3},
    {icon: <IconApple size={64} />, text: 'تناول المزيد من الأطعمة الكاملة', start: K.o4},
  ];

  return (
    <AbsoluteFill>
      <TitleAR text="خبر سار: يمكنك تقليل خطر الإصابة" color={C.teal} />

      <div style={{position: 'absolute', right: 120, top: 140, width: 840, fontFamily: AR, textAlign: 'right', ...RTL}}>
        <div style={{transform: `scale(${Math.max(0, heart) * beat})`, transformOrigin: 'right center', display: 'flex', justifyContent: 'flex-start'}}>
          <IconHeart size={120} />
        </div>
        <div style={{fontSize: 260, fontWeight: 700, lineHeight: 1.1, color: C.teal, direction: 'ltr', textAlign: 'right', marginTop: 26}}>
          {pct}%
        </div>
        <div style={{fontSize: 46, fontWeight: 700, color: C.navy, lineHeight: 1.5, marginTop: 4, ...fadeUp(prog(f, 90, 24))}}>
          انخفاض في خطر الإصابة بالسكري من النوع 2
          <br />
          عند تغيير نمط الحياة
        </div>
        <div style={{fontSize: 26, color: C.gray, marginTop: 10, lineHeight: 1.5, ...fadeUp(prog(f, 110, 24))}}>
          تجربة سريرية كبرى (برنامج الوقاية من السكري)،
          <br />
          على مدى نحو 3 سنوات
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 290,
          width: 840,
          display: 'flex',
          flexDirection: 'column',
          gap: 30,
          fontFamily: AR,
          direction: 'rtl',
        }}
      >
        {actions.map((a, i) => {
          const p = pop(f, a.start);
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                padding: '16px 30px 22px',
                backgroundColor: C.white,
                border: `2.5px solid ${C.line}`,
                borderRadius: 24,
                boxShadow: '0 4px 14px rgba(27,58,107,0.08)',
                opacity: Math.min(1, p * 1.6),
                transform: `translateX(${(1 - Math.min(1, p)) * -60}px)`,
                ...RTL,
              }}
            >
              <div style={{width: 64, height: 64, flexShrink: 0}}>{a.icon}</div>
              <div style={{fontSize: 38, fontWeight: 700, color: C.navy, lineHeight: 1.5}}>{a.text}</div>
            </div>
          );
        })}
      </div>

      <CaptionAR
        items={[
          {from: K.o1, text: 'في تجربة كبرى، خفّض تغيير نمط الحياة خطر السكري من النوع الثاني بنسبة 58%.'},
          {from: K.o2, text: 'اخسر من 5 إلى 7% من وزنك.'},
          {from: K.o3, text: 'وتحرّك 150 دقيقة أسبوعيًا.'},
          {from: K.o4, text: 'وتناول أطعمة كاملة أكثر.'},
        ]}
      />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------- */
/*  Scene 7: Take action + purpose + references                               */
/* -------------------------------------------------------------------------- */

const CloseAR: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    'تعرّف على عوامل الخطر لديك',
    'تحدّث مع طبيبك عن إجراء تحليل للدم',
    'تحرّك أكثر، وكُل صحيًا، ونم جيدًا',
    'خطوات صغيرة اليوم تحمي صحتك',
  ];
  const starts = [K.c1 + 6, K.c1 + 60, K.c2 + 5, K.c2 + 45];

  return (
    <AbsoluteFill>
      <TitleAR text="ابدأ اليوم" />

      <div style={{position: 'absolute', right: 260, top: 140, fontFamily: AR, direction: 'rtl'}}>
        {items.map((t, i) => {
          const p = pop(f, starts[i]);
          return (
            <div
              key={t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                height: 82,
                opacity: Math.min(1, p * 1.6),
                transform: `translateX(${(1 - Math.min(1, p)) * 40}px)`,
                ...RTL,
              }}
            >
              <CheckCircle size={52} />
              <div style={{fontSize: 46, fontWeight: 700, color: C.navy, lineHeight: 1.5, paddingBottom: 6}}>{t}</div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 200,
          width: 1520,
          top: 490,
          boxSizing: 'border-box',
          fontFamily: AR,
          backgroundColor: C.white,
          border: `3px solid ${C.teal}`,
          borderRadius: 24,
          padding: '8px 40px 14px',
          textAlign: 'right',
          ...RTL,
          ...fadeUp(prog(f, K.c3, 26)),
        }}
      >
        <div style={{fontSize: 28, fontWeight: 700, color: C.teal, lineHeight: 1.6}}>لماذا أنتجنا هذا الفيديو</div>
        <div style={{fontSize: 40, color: C.navy, lineHeight: 1.5}}>
          لنشر الوعي المجتمعي وتثقيف الناس حول ما قبل السكري.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 200,
          width: 1520,
          top: 690,
          boxSizing: 'border-box',
          fontFamily: AR,
          backgroundColor: 'rgba(255,255,255,0.9)',
          border: `2px solid ${C.line}`,
          borderRadius: 24,
          padding: '8px 40px 14px',
          textAlign: 'right',
          ...RTL,
          ...fadeUp(prog(f, K.c3 + 60, 26)),
        }}
      >
        <div style={{fontSize: 26, fontWeight: 700, color: C.gray, lineHeight: 1.6}}>المراجع</div>
        <div style={{fontSize: 30, color: C.navy, lineHeight: 1.6}}>
          {`الجمعية الأمريكية للسكري ${LTR('(ADA)')} – معايير الرعاية الطبية في السكري`}
        </div>
        <div style={{fontSize: 30, color: C.navy, lineHeight: 1.6}}>
          {`مراكز السيطرة على الأمراض والوقاية منها ${LTR('(CDC)')} – إرشادات ما قبل السكري`}
        </div>
      </div>

      <CaptionAR
        items={[
          {from: K.c1, text: 'تعرّف على عوامل خطرك، وتحدّث مع طبيبك عن تحليل الدم.'},
          {from: K.c2, text: 'تحرّك أكثر، وكُل صحيًا، ونم جيدًا.'},
          {from: K.c3, text: 'هدفنا نشر الوعي المجتمعي وتثقيف الناس عن ما قبل السكري.'},
          {from: K.c4, text: 'هذا الفيديو للتوعية فقط، وليس نصيحة طبية.'},
        ]}
      />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------------------- */
/*  Main Arabic composition                                                   */
/* -------------------------------------------------------------------------- */

export const ExplainerVideoAR: React.FC = () => {
  const scenes: Array<{d: number; node: React.ReactNode}> = [
    {d: DUR.intro, node: <IntroAR />},
    {d: DUR.gauge, node: <GaugeAR />},
    {d: DUR.body, node: <BodyAR />},
    {d: DUR.risks, node: <RisksAR />},
    {d: DUR.tests, node: <TestsAR />},
    {d: DUR.good, node: <GoodAR />},
    {d: DUR.close, node: <CloseAR />},
  ];

  let from = 0;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Background />
      <Audio src={voiceoverAr} />
      {scenes.map((s, i) => {
        const start = from;
        from += s.d;
        return (
          <Sequence key={i} from={start} durationInFrames={s.d}>
            <SceneFade duration={s.d}>{s.node}</SceneFade>
          </Sequence>
        );
      })}
      <ProgressBarAR />
    </AbsoluteFill>
  );
};
