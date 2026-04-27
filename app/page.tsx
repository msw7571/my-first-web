import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">개인 블로그</h1>
        <p className="text-xl text-muted-foreground">
          어울리는 테마로 새롭게 단장한 블로그입니다.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>첫 번째 포스트</CardTitle>
            <CardDescription>2026년 4월 27일</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="leading-7">
              블로그의 본문 글자가 선명하게 보이도록 설정을 조정했습니다. 
              충분한 가독성을 확보하면서도 눈이 편안한 색감을 사용했습니다.
            </p>
            <Button className="mt-4" variant="default">
              더 보기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>디자인 원칙</CardTitle>
            <CardDescription>깔끔함과 차분함</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="leading-7">
              과한 그라디언트나 강한 그림자를 배제하고, 
              평면적이면서도 깊이감 있는 디자인을 추구합니다.
            </p>
            <Button className="mt-4" variant="outline">
              공유하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
