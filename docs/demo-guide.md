# Demo Guide - Video Walkthrough Scripts

> Merged from work/member1_sadman.md, member2_aronti.md, member3_sanjid.md. Each member presents own part with own voice.

---

# Member 1 — Sadman Saif Zarif | Input & Storage Lead

## Introduction
*"I handled the first two subsystems — cargo input validation and the dock weight accumulator. These are the entry point of the entire system: nothing happens downstream unless my part works correctly."*

---

## What to Show & Where to Click

### Step 1 — Point to the Input Switches (top-left)
> Gesture to SW0–SW3 (the four LOGICSTATE switches on the far left labeled SW3, SW2, SW1, SW0).

*"These four switches encode the incoming cargo weight in binary — SW0 = 1, SW1 = 2, SW2 = 4, SW3 = 8. Together they represent values 0 to 15."*

---

### Step 2 — Show the OR-tree (U1:A, U1:B, U1:C)
> Point to the three OR gates (74LS32) chained together just right of the switches.

*"The OR-tree detects if any cargo is present. If all switches are LOW — meaning an empty ship — the output stays LOW and the system ignores the arrival. No dedicated encoder needed."*

---

### Step 3 — AND gate + Enable (U2:A)
> Point to the AND gate (74LS08, U2:A) receiving the OR-tree output and the enable signal.

*"When cargo is detected, this AND gate, gated with an active-HIGH enable, produces a validated arrival signal."*

---

### Step 4 — NOT gate pulse (U8:A)
> Point to the small inverter (74LS04, U8:A) below and slightly right.

*"The NOT gate flips that signal to active-LOW, which triggers the Parallel Load pin (Pin 11) of the register — that's what actually captures the new weight."*

---

### Step 5 — Register + Adder feedback loop (U6, U7, R1)
> Point to U6\_DOCK\_REG (74LS193) and U7\_ACC\_ADDER (74LS283) in the center-left. Trace the feedback wires looping from Q0–Q3 back into the adder.

*"U7 continuously adds the incoming cargo weight to the current register value. U6 stores the running total. The pull-up resistor R1 on Pin 11 prevents the register from spuriously loading during Proteus simulation startup."*

*"Q0–Q3 output from U6 feeds three places simultaneously — the BCD display subsystem, the comparator, and back into the adder. That's my handoff to the other two members."*

---

## Key Takeaway
*"My subsystems are the heartbeat of the circuit — every cargo accumulation starts here."*


---

# Member 2 — Ayesha Chowdhury Aronti | Visualization Lead

## Introduction
*"I handled the BCD correction network and the dual 7-segment display. My job is to take the raw binary weight from the accumulator and show it as a readable decimal number on screen."*

---

## What to Show & Where to Click

### Step 1 — Point to the BCD Detection Gates (top-center)
> Point to U2:B, U2:C (74LS08 AND gates) and U1:D (74LS32 OR gate) — the cluster of gates at the top-right area of the schematic.

*"The accumulator outputs Q0–Q3. When the total exceeds 9, standard 4-bit binary can't display it correctly in decimal. These gates detect that — specifically, they check if Q3·Q2 or Q3·Q1 is HIGH, which means the sum is 10 or above."*

---

### Step 2 — BCD Correction Adder (U5\_ADDER)
> Point to U5 (74LS283) — the adder IC on the right side, labeled U5\_ADDER.

*"When the detection flag is HIGH, U5 adds +6 (binary 0110) to the raw sum. This is standard BCD correction — it shifts the value into valid decimal range."*

---

### Step 3 — Decoder and Display: Units digit (U4, D1\_UNITS)
> Point to U4 (74LS47) and the right 7-segment display labeled D1\_UNITS.

*"The corrected lower 4 bits go into U4, which decodes them to drive the Units digit display."*

---

### Step 4 — Decoder and Display: Tens digit (U3, D1\_TENS)
> Point to U3 (74LS47) and the left 7-segment display labeled D1\_TENS.

*"The overflow bit — whether the sum exceeded 9 — feeds U3, which drives the Tens digit. It only ever shows 0 or 1, since our max accumulation is 19."*

*"All control pins — LT, BI/RBO, RBI — are tied HIGH on both decoders so the displays stay permanently active with no dimming or blanking."*

---

## Key Takeaway
*"My subsystem is what makes the circuit human-readable. Without BCD correction, the display would show garbage for any weight above 9."*


---

# Member 3 — Sanjid Ahsan | Automation Lead

## Introduction
*"I handled the magnitude comparator with the status LEDs, and the ship departure counter with the automated dock reset. My part is what gives the system intelligence."*

---

## What to Show & Where to Click

### Step 1 — Capacity Threshold Switches (bottom-left)
> Point to B0–B3 switches (four LOGICSTATE inputs, lower-left area).

*"The operator sets the ship's rated capacity here using B0–B3. This is the threshold the system continuously compares against."*

---

### Step 2 — Magnitude Comparator (U9, 74LS85)
> Point to U9 in the lower-center area of the schematic.

*"U9 is a 4-bit magnitude comparator. It takes the live dock weight from Q0–Q3 on the A-inputs, and the capacity threshold from B0–B3 on the B-inputs. The cascade pins are hardwired — Pin 3 to VCC, Pins 2 and 4 to GND — configuring it as a standalone comparator."*

---

### Step 3 — Three Status LEDs (D1, D2, D3)
> Point to the three LEDs (Yellow D1, Red D2, Green D3) to the right of U9, with resistors R2–R4.

*"Three outputs, three states: Yellow means under capacity — still loading. Red means overload — too heavy. Green means exact match — full ship, time to depart."*

---

### Step 4 — The QA=B Fanout (3-way split)
> Trace the wire from Pin 6 of U9 splitting three ways — to Green LED anode, to U10 clock pin, and back up to U6 MR pin.

*"When the green condition triggers, this single wire does three things simultaneously: lights the green LED, increments the departure counter, and resets the dock register to zero — instantly readying the dock for the next ship."*

---

### Step 5 — Departure Counter + Display (U10, U11)
> Point to U10 (74LS90 decade counter) and U11 (74LS47) driving the single 7-segment display at the bottom.

*"U10 counts departures from 0 to 9 in BCD mode. Q0 is wired to CKB, all reset pins are grounded. U11 decodes and shows the running count on the display."*

---

## Key Takeaway
*"My subsystem is the decision engine — it monitors, alarms, and automates. The dock resets itself the moment a ship is full, with zero manual intervention."*
