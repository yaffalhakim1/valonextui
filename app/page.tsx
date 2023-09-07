"use client";
/* eslint-disable @next/next/no-img-element */

import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
  Skeleton,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

async function getHeroes() {
  const agents = await fetch("https://valorant-api.com/v1/agents");
  const data = await agents.json();

  return data.data;
}

async function getHero(id: string) {
  const agent = await fetch(`https://valorant-api.com/v1/agents/${id}`);
  const data = await agent.json();

  return data.data;
}

export default function Home() {
  const [hero, setHero] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHero, setSelectedHero] = useState<any>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    getHeroes()
      .then((heroes) => {
        setHero(heroes);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []);

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-10">
        {loading ? (
          <div>
            {hero.map((hero: any) => (
              <Card
                className="w-[200px] space-y-5 p-4"
                radius="lg"
                key={hero.uuid}
              >
                <Skeleton className="rounded-lg">
                  <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div className="space-y-3">
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                  </Skeleton>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
            {hero.map((hero: any) => (
              <Card className="py-4" key={hero.uuid}>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <small className="text-default-500">
                    {hero.role ? hero.role.displayName : "Role Not Found"}
                  </small>
                  <h4 className="font-bold text-large">{hero.displayName}</h4>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <div className="relative ">
                    <div
                      className="absolute inset-0 rounded-xl "
                      style={{
                        backgroundImage: `url('${hero.background}')`, // Replace with the background image URL
                      }}
                    ></div>
                    <Image
                      isZoomed
                      alt="Card background"
                      className="object-cover rounded-xl"
                      src={hero.fullPortraitV2}
                      width={270}
                      height={200}
                    />
                  </div>
                </CardBody>
                <CardFooter className="mx-auto  ml-1 z-10">
                  <Button
                    className="text-sm text-white w-full"
                    variant="shadow"
                    color="primary"
                    radius="lg"
                    size="md"
                    onPress={() => {
                      getHero(hero.uuid).then((heroData) => {
                        setSelectedHero(heroData);
                        setModalIsOpen(true);
                      });
                    }}
                  >
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={modalIsOpen}
        placement="auto"
        onOpenChange={() => setModalIsOpen(!modalIsOpen)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3>{selectedHero?.displayName}</h3>
                <small>{selectedHero?.role?.displayName}</small>
              </ModalHeader>
              <ModalBody>
                <p>{selectedHero?.description}</p>
                <div className="flex gap-3 items-center">
                  {selectedHero?.abilities.map((ability: any) => (
                    <div key={ability}>
                      <Tooltip
                        showArrow={true}
                        content={
                          <div className="px-1 py-2">
                            <div className="text-md font-bold">
                              {ability.displayName}
                            </div>
                            <div className="text-small">
                              {ability.description}
                            </div>
                          </div>
                        }
                      >
                        <Avatar src={ability.displayIcon} />
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => setModalIsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    setModalIsOpen(false);
                  }}
                >
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
