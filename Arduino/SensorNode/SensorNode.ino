#include <Wire.h>           // Wire 라이브러리를 포함
#include <AM2320.h>         // AM2320 라이브러리를 포함
AM2320 th;                  // AM2320 선언     

int flameApin = A1;
int gasApin = A0; 
int flameDpin = 7;

void setup() {
  Serial.begin(9600);        // 시리얼 통신 시작
  pinMode(flameDpin, INPUT);
}

void loop() {
  char req = Serial.read();
  
  if(req == 'h') {
    th.Read();
    Serial.println(th.h);
  } else if(req == 't') {
    th.Read();
    Serial.println(th.t);
  } else if(req == 'F') {
    Serial.println(digitalRead(flameDpin));
  } else if(req == 'f') {
    Serial.println(analogRead(A1));
  } else if(req == 'g') {
    Serial.println(analogRead(A0));
  }
  
//  th.Read();                          // AM2320 읽기
//  Serial.print("humidity: ");        // 시리얼 모니터에 humidity 출력
//  Serial.print(th.h);                // 시리얼 모니터에 습도값(h) 출력
//  Serial.print("%, temperature: ");  // 시리얼 모니터에 temperature 출력
//  Serial.print(th.t);                // 시리얼 모니터에 온도값(t) 출력
//  Serial.println("C");
//  Serial.print("Flame D: ");
//  Serial.println(digitalRead(flameDpin));
//  Serial.print("Flame A: ");
//  Serial.println(analogRead(A1));
//  Serial.print("Gas: ");
//  Serial.println(analogRead(A0));
//  
//  delay(1000);                         // 1초 딜레이
}
